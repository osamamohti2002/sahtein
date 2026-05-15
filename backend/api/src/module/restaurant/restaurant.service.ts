import { BadRequestException, ForbiddenException, Injectable, NotFoundException,  } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RestaurantService {

  constructor(private readonly prisma: PrismaService) { }

  async applyRestaurant(userId: string, data: CreateRestaurantDto) {
    const restaurantOwner = await this.prisma.user.findUnique({
      where:{
        id:userId
      }
    });

    if(!restaurantOwner){
      throw new NotFoundException("User Not Found ");
    };

    const existingRestaurant = await this.prisma.restaurant.findUnique({
      where:{
        userId:userId
      }
    })

    if(existingRestaurant){
      throw new BadRequestException("You already have a restaurant");
    };

    const restaurant = await this.prisma.restaurant.create({
      data:{
        userId:userId,
        name:data.name,
        address:data.address,
        phoneNumber:data.phoneNumber,
        logoUrl:data.logoUrl,
        headerImageUrl:data.headerImageUrl,
        deliveryTimeMin:data.deliveryTimeMin,
        deliveryTimeMax:data.deliveryTimeMax
      }
    })
    
    return {
      message:"Restaurant Created Successfully",
      data: restaurant
    };

  }




}
