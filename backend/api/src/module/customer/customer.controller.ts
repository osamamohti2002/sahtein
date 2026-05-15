import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateCustomerProfileDto } from './dto/create-customer-profile.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

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

  @Post('add-address')
  @UseGuards(JwtAuthGuard)
  addAddress(@CurrentUser() user: any, @Body() data: CreateAddressDto){
    return this.customerService.addAddress(user.sub, data);
  }

  @Patch('update-address/:addressId')
  @UseGuards(JwtAuthGuard)
  updateAddress(@CurrentUser() user: any, @Param('addressId') addressId: string, @Body() data: UpdateAddressDto){
    return this.customerService.updateAddress(user.sub, addressId, data);
  }

  @Delete('delete-address/:addressId')
  @UseGuards(JwtAuthGuard)
  deleteAddress(@CurrentUser() user: any, @Param('addressId') addressId: string){
    return this.customerService.deleteAddress(user.sub, addressId);
  }

  @Get('get-all-addresses')
  @UseGuards(JwtAuthGuard)
  getAllAddresses(@CurrentUser() user: any){
    return this.customerService.getAllAddresses(user.sub);
  }

  @Patch('set-default-address/:addressId')
  @UseGuards(JwtAuthGuard)
  setDefaultAddress(@CurrentUser() user: any, @Param('addressId') addressId: string){
    return this.customerService.setDefaultAddress(user.sub, addressId);
  }
}
