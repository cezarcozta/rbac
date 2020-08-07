import {
  PrimaryGeneratedColumn, 
  Entity, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';

import Permission from '../entities/Permission';

@Entity('roles')
class Role {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  level: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'permissions_roles',
    joinColumns: [{name: 'role_id'}],
    inverseJoinColumns: [{name: 'permission_id'}]
  })
  permissions: Permission[];
}

export default Role;