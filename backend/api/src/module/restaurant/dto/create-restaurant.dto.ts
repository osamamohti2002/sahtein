import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRestaurantDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    logoUrl: string;

    @IsString()
    @IsNotEmpty()
    headerImageUrl: string;

    @IsNumber()
    @IsNotEmpty()
    deliveryTimeMin: number

    @IsNumber()
    @IsNotEmpty()
    deliveryTimeMax: number

}
