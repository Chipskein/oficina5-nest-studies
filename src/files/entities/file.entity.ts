import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class File {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty()
    @Column()
    name: string;
    
    @ApiProperty()
    @Column()
    size: number;
    
    @ApiProperty()
    @Column()
    url: string;
    
    @ApiProperty()
    @Column()
    extension: string;
    
    @ApiProperty()
    @Column()
    mimetype: string;

    @ManyToOne(()=>User,user=>user.files)
    user:User;
}
