import {Entity,Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm'

interface IPhoto {
    id?: number,
    name: string,
    description: string
    filename: string,
    views: number
    isPublished: boolean

}

@Entity()
export class Photo implements IPhoto {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({length: 100})
    name: string;

    @Column("text")
    description: string;

    @Column()
    filename: string;

    @Column("double")
    views: number;

    @Column()
    isPublished: boolean;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
    



}