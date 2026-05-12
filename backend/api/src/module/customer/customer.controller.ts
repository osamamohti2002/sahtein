import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateCustomerProfileDto } from './dto/create-customer-profile.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create-customer-profile')
  @UseGuards(JwtAuthGuard)
  createCustomerProfile(@CurrentUser() user: any, @Body() data: CreateCustomerProfileDto){
    return this.customerService.createCustomerProfile(user.sub, data);
  }

  @Get('get-customer-profile')
  @UseGuards(JwtAuthGuard)
  getCustomerProfile(@CurrentUser() user: any){
    return this.customerService.getCustomerProfile(user.sub);
  }

  @Patch('update-customer-profile')
  @UseGuards(JwtAuthGuard)
  updateCustomerProfile(@CurrentUser() user: any, @Body() data: UpdateCustomerProfileDto){
    return this.customerService.updateCustomerProfile(user.sub, data);
  }

}
