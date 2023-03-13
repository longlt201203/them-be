import { ApiProperty } from "@nestjs/swagger";
import { IsStrongPassword } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    @IsStrongPassword()
    password: string;
}