import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { State } from "./state.entity";

@Entity()
export class Country {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    iso2: string;

    @Column()
    iso3: string;

    @Column()
    code: string;

    @OneToMany(() => State, state => state.country)
    states: State[];
}