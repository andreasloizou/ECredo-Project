import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class ClientEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}