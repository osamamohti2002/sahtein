import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerProfileDto } from './dto/create-customer-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';

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

  async updateCustomerProfile(userId: string, data: UpdateCustomerProfileDto){
    const existingCustomerProfile = await this.prisma.customerProfile.findUnique({
      where:{
        userId: userId
      }
    });

    if(!existingCustomerProfile){
      throw new BadRequestException('Customer Profile Not Found')
    }

    if(data.phoneNumber){
      const existingPhoneNumber = await this.prisma.customerProfile.findUnique({
        where:{
          phoneNumber: data.phoneNumber
        }
      });

      if(existingPhoneNumber && existingPhoneNumber.userId !== userId){
        throw new BadRequestException('Phone number already exists');
      }
    }

    const updatedCustomerProfile = await this.prisma.customerProfile.update({
      where:{
        userId: userId
      },
      data:{
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl,
      }
    });
    return {
      message: 'Customer profile updated successfully',
      data: updatedCustomerProfile
    }
  }

  async addAddress(userId: string, data: CreateAddressDto){
    const existingCustomerProfile = await this.prisma.customerProfile.findUnique({
      where:{
        userId: userId
      }
    });

    if(!existingCustomerProfile){
      throw new BadRequestException('Customer Profile Not Found')
    };

    if(data.isDefault){
      await this.prisma.address.updateMany({
        where:{
          customerProfileID: existingCustomerProfile.id,
          isDefault: true
        },
        data:{
          isDefault: false
        }
      });
    };

    const newAddress = await this.prisma.address.create({
      data:{
        customerProfileID: existingCustomerProfile.id,
        ...data
      }
    });

    return {
      message: 'Address added successfully',
      data: newAddress
    };


  }
}
