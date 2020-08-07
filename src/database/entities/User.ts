import {
  PrimaryGeneratedColumn, 
  Entity, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToMany, 
  JoinTable
} from 'typeorm';

import { Expose, Exclude } from 'class-transformer';

import Role from './Role';

@Entity('users')
class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column()
  email: string;

  @Column()
  profile_image: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'users_roles',
    joinColumns: [{name: 'user_id'}],
    inverseJoinColumns: [{name: 'role_id'}]
  })
  roles: Role[];

  @Expose({ name: 'profile_img_url' })
  getImageUrl(): string | null {
    if (!this.profile_image) {
      return null;
    }

    return `${process.env.APP_API_URL}/files/${this.profile_image}`;
  }
}

export default User;