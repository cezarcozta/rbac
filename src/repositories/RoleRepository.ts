import { Repository, EntityRepository } from 'typeorm';
import Role from '../database/entities/Role';

@EntityRepository(Role)
class RoleRepository extends Repository<Role>{

}

export default RoleRepository;