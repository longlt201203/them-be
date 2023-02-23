import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    password: string;
}