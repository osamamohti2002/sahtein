import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateCustomerProfileDto } from './dto/create-customer-profile.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create-customer-profile')
  @UseGuards(JwtAuthGuard)
  createCustomerProfile(@CurrentUser() user: any, @Body() data: CreateCustomerProfileDto){
    return this.customerService.createCustomerProfile(user.sub, data);

  }
}
