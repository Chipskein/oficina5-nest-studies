import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    user:User;
    
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
}
