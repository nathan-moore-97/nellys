import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GalleryImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    filename: string;

    @Column()
    uploadDate: Date;

    @Column()
    url: string;
}