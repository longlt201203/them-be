import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./region.entity";

@Entity()
export class County {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    zipcode: string;

    @ManyToOne(() => Region, region => region.counties, { onDelete: 'CASCADE' })
    region: Region;
}