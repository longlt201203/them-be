import { ApiProperty } from "@nestjs/swagger";
import { UrgentEnum, PayTypeEnum } from "../../etc/enums";

export class CreatePostDto {
    @ApiProperty()
    reasons: string;

    @ApiProperty()
    descriptionText: string;

    @ApiProperty()
    descriptionMedias: string;

    @ApiProperty({ enum: UrgentEnum, default: UrgentEnum.NORMAL })
    urgent: UrgentEnum;

    @ApiProperty()
    address: string;

    @ApiProperty({ enum: PayTypeEnum, default: PayTypeEnum.FIXED })
    payType: PayTypeEnum;

    @ApiProperty()
    payAmount: number;
}