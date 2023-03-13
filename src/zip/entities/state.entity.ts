import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";
import { Region } from "./region.entity";

@Entity()
export class State {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Region, region => region.state)
    regions: Region[];

    @ManyToOne(() => Country, country => country.states, { onDelete: 'CASCADE' })
    country: Country;
}