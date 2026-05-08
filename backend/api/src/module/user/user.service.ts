import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

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
}
