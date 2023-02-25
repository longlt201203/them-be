import { UrgentEnum, PayTypeEnum, PostStatusEnum } from "../../etc/enums";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ThemPost {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    reasons: string;

    @Column()
    descriptionText: string;

    @Column()
    descriptionMedias: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ enum: UrgentEnum, default: UrgentEnum.NORMAL })
    urgent: UrgentEnum;

    @Column()
    address: string;

    @Column({ enum: PayTypeEnum, default: PayTypeEnum.FIXED })
    payType: PayTypeEnum;

    @Column()
    payAmount: number;

    @Column({ enum: PostStatusEnum, default: PostStatusEnum.OPEN })
    status: PostStatusEnum;

    @ManyToOne(() => User, user => user.posts)
    user: User;
}