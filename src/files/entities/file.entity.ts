import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    size: number;
    
    @Column()
    url: string;
    
    @Column()
    extension: string;
    
    @Column()
    mimetype: string;

    @ManyToOne(()=>User,user=>user.files)
    user:User;
}
