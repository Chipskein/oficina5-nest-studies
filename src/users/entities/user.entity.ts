
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { File } from '../../files/entities/file.entity'
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => File, file => file.user)
  files: File[];

}