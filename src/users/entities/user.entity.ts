import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { File } from '../../files/entities/file.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @Column()
  password: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @OneToMany(() => File, (file) => file.user)
  files: File[];
}
