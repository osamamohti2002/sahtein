import { BadRequestException, Injectable } from "@nestjs/common";
import type { Request } from 'express';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/module/prisma/prisma.service";
import * as bcrypt from 'bcrypt';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(private readonly prisma: PrismaService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET as string,
            passReqToCallback: true,
        })
    }

    async validate(req: Request, payLoad: any){
        const refreshtoken = req.headers['authorization']?.split(' ')[1];

        if(!refreshtoken){
            throw new BadRequestException("Refresh token not found!")
        }

        const storedToken = await this.prisma.refreshToken.findFirst({
            where: {
                userId: payLoad.sub
            }
        })

        if(!storedToken){
            throw new BadRequestException("Refresh token not found in database!")
        }

        const isTokenValid = await bcrypt.compare(refreshtoken, storedToken.token);

        if(!isTokenValid){
            throw new BadRequestException("Invalid refresh token!")
        }

        if(storedToken.expiresAt < new Date()){
            await this.prisma.refreshToken.delete({
                where: { id: storedToken.id }
            })
            throw new BadRequestException("Refresh token has expired!")
        }

        return { userId: payLoad.sub, refreshToken: refreshtoken, ...payLoad,};
    }
}