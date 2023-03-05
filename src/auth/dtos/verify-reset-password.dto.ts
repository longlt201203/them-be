import { ApiProperty } from "@nestjs/swagger";

export class VerifyResetPasswordCodeDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    code: string;
}