import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth-dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';


@Injectable()
export class AuthService {

  constructor(private readonly prisma: PrismaService){}


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
      user: newUser
    }


  }
  async login(loginAuthDto: LoginAuthDto){
    return "login auth";
  }
}
