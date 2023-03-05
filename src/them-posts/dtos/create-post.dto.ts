import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";
import { UrgentEnum, PayTypeEnum } from "../../etc/enums";

export class CreatePostDto {
    @ApiProperty()
    @Matches(/^\w+(,\w+){0,}$/)
    reasons: string;

    @ApiProperty()
    descriptionText: string;

    @ApiProperty()
    @Matches(/^\w+(,\w+){0,}$/)
    descriptionMedias: string;

    @ApiProperty({ enum: UrgentEnum, default: UrgentEnum.NORMAL })
    @IsEnum(UrgentEnum)
    urgent: UrgentEnum;

    @ApiProperty()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ enum: PayTypeEnum, default: PayTypeEnum.FIXED })
    @IsEnum(PayTypeEnum)
    payType: PayTypeEnum;

    @ApiProperty()
    @IsNumber()
    payAmount: number;
}