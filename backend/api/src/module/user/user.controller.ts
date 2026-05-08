import { Controller, Get, UseGuards, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: any){
    return this.userService.getMe(user.sub);
  }

  @Patch('update-profile')
  @UseGuards(JwtAuthGuard)
  updateMe(@CurrentUser() user: any, @Body() data: UpdateUserDto){
    return this.userService.updateMe(user.sub, data);
  }

  @Patch('update-password')
  @UseGuards(JwtAuthGuard)
  updatePassword(@CurrentUser() user: any, @Body() data: UpdatePasswordDto){
    return this.userService.updatePassword(user.sub, data);
  }
}