import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword, IsNotEmpty, IsPhoneNumber, IsOptional } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsOptional()
    @IsStrongPassword()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    fname: string;

    @ApiProperty()
    @IsNotEmpty()
    lname: string;

    @ApiProperty()
    @IsPhoneNumber('VN')
    @IsOptional()
    phone: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    zipCode: string;

    @ApiProperty()
    avt: string;

    @ApiProperty()
    cover: string;
}