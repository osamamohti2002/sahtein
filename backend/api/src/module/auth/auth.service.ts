import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth-dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService){}


  async create(data: CreateAuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where:{
        email: data.email
      }
    });

    if(existingUser){
      throw new BadRequestException("This user already exist!");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const newUser = await this.prisma.user.create({
      data:{
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: Role.CUSTOMER 
      }
    });

    return{
      message: "User created successfully",
      user: {newUser, exclude: ["password"]}
    }


  }
  async login(loginAuthDto: LoginAuthDto){
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email
      }
    });

    if(!user){
      throw new BadRequestException("This user doesn't exist!");
    }

    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password
    );

    if(!isPasswordValid){
      throw new BadRequestException("Invalid Password!")
    };

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    const tokens = await this.generateTokens(payload, user.id);
    return{
      message: "User logined successfully!",
      user: payload,
      ...tokens
    }
  }

  private async generateTokens(payload: { sub: string; name: string; email: string; role: Role }, userId: string) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m'
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await this.prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        userId: userId,
        expiresAt: expiresAt
      }
    })

    return {
      accessToken,
      refreshToken
    };
  }
}
