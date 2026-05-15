import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { PrismaService } from './module/prisma/prisma.service';
import { UserModule } from './module/user/user.module';
import { CustomerModule } from './module/customer/customer.module';
import { RestaurantModule } from './module/restaurant/restaurant.module';

@Module({
  imports: [
    AuthModule, 
    PrismaModule, 
    UserModule, 
    CustomerModule, 
    RestaurantModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
