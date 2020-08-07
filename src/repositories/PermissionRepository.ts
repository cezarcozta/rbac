import { Repository, EntityRepository } from 'typeorm';
import Permission from '../database/entities/Permission';

@EntityRepository(Permission)
class PermissionRepository extends Repository<Permission>{

}

export default PermissionRepository;