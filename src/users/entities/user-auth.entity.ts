import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserAuth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    lastLoggedIn: Date;

    @Column({ nullable: true })
    verifyEmailAt: Date;

    @Column({ default: false })
    isResetPassword: boolean;

    @Column({ nullable: true, length: 1000 })
    refreshToken: string;

    @Column({ nullable: true, length: 1000 })
    resetPasswordToken: string;

    @Column({ nullable: true, length: 1000 })
    verifyEmailToken: string;
}