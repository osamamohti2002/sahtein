import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Role } from "@prisma/client";


interface JwtPayLoad{
    sub: string;
    name: string;
    email: string;
    role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET as string,
        })
    }

    async validate(payload: JwtPayLoad): Promise<JwtPayLoad>{
        return payload;
    }
}