import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerProfileDto } from './dto/create-customer-profile.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {

  constructor(private readonly prisma: PrismaService){}

  async createCustomerProfile(userId: string, data: CreateCustomerProfileDto) {
    const existingCustomerProfile = await this.prisma.customerProfile.findUnique({
      where:{
        userId: userId
      }
    });

    if(existingCustomerProfile){
      throw new BadRequestException('Customer profile already exists');
    }

    const newCustomerProfile = await this.prisma.customerProfile.create({
      data:{
        userId: userId,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl,
      }
    });
    return {
      message: 'Customer profile created successfully',
      data: newCustomerProfile
    }
    
  }

  async getCustomerProfile(userId: string){
    const customerProfile = await this.prisma.customerProfile.findUnique({
      where: {
        userId: userId
      },
      include:{
        user:{
          select:{
            name: true,
            email: true
          }
        },
        addresses:true
      }
    });

    if (!customerProfile){
      throw new BadRequestException('Customer Profile Not Found')
    }

    return {
      message: 'Customer profile fetched successfully',
      data: customerProfile
    }
  }

}
