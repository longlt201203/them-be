import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserAuth } from "./user-auth.entity";
import { ThemPost } from "../../them-posts/entities/them-posts.entity";

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

    @Column({ nullable: true })
    avt: string;

    @OneToOne(() => UserAuth, { cascade: true })
    @JoinColumn()
    userAuth: UserAuth;

    @OneToMany(() => ThemPost, post => post.user)
    posts: ThemPost[];
}