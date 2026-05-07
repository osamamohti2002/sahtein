import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth-dto';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto){
    return this.authService.login(loginAuthDto)
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refreshTokens(@CurrentUser() user: any){
    return this.authService.refreshTokens(user.sub, user.refreshToken)
  }
  
  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  logout(@CurrentUser() user: any){
    return this.authService.logout(user.sub)
  }
}
