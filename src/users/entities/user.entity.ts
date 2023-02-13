import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserAuth } from "./user-auth.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    fname: string;

    @Column({ nullable: true })
    lname: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    zipCode: string;

    @OneToOne(() => UserAuth, { cascade: true })
    @JoinColumn()
    userAuth: UserAuth;
}