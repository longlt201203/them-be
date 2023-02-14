import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty()
    emailOrPhone: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    remember: boolean;
}