import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCustomerProfileDto {

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string;
}