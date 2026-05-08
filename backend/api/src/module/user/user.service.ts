import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService){}

  async getMe(userId: string){
    const user = await this.prisma.user.findUnique({
      where:{
        id: userId,
      },
      select: {
        name: true,
        email: true,
        id: true,
        role: true,
        customerProfile: true,
      }
    });

    if (!user){
      throw new NotFoundException('User not found');
    }
    return {
      message: `welcome ${user?.name}`,
      user: user
    };

  }

  async updateMe(userId: string, data: UpdateUserDto){
    
    if (data.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Email already exists');
      }
    }
    
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name: data.name,
        email: data.email,
      },
      select: {
        name: true,
        email: true,
        id: true,
        role: true,
        customerProfile: true,
      }
    });

    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  async updatePassword(userId: string, data: UpdatePasswordDto){
    const user = await this.prisma.user.findUnique({
      where:{
        id: userId
      }
    });

    if (!user){
      throw new NotFoundException("user not found");
    };

    if (data.newPassword !== data.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    };

    if (data.oldPassword === data.newPassword) {
      throw new BadRequestException('New password cannot be the same as the old password');
    }

    const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);

    if (!isPasswordValid){
      throw new BadRequestException('Invalid current password');
    };

    const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

    await this.prisma.user.update({
      where:{
        id: userId
      },
      data:{
        password: hashedNewPassword
      }
    });
    return{
      message: "Password updated successfully"
    };
  }
}
