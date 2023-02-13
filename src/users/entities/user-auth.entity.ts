import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserAuth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    lastLoggedIn: Date;
}