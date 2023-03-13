import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { County } from "./county.entity";
import { State } from "./state.entity";

@Entity()
export class Region {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => County, county => county.region)
    counties: County[];

    @ManyToOne(() => State, state => state.regions, { onDelete: 'CASCADE' })
    state: State;
}