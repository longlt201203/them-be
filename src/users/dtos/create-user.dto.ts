import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsStrongPassword()
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    fname: string;

    @ApiProperty()
    @IsNotEmpty()
    lname: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    zipCode: string;

    @ApiProperty()
    avt: string;
}