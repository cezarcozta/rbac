import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import RoleRepository from '../repositories/RoleRepository';
import PermissionRepository from '../repositories/PermissionRepository';

class RoleController {
  async create(request: Request, response :Response) {
    const roleRepository = getCustomRepository(RoleRepository);
    const permissionRepository = getCustomRepository(PermissionRepository);

    const { level, name, description, permissions } = request.body;

    const existsRole = await roleRepository.findOne({name});

    if(existsRole){
      return response.status(400).json({error: 'Role already exists'});
    }

    const existsPermissions = await permissionRepository.findByIds(permissions)

    const role = roleRepository.create({
      level,
      name, 
      description,
      permissions: existsPermissions,
    });

    await roleRepository.save(role);

    return response.status(201).json({role});
  }

  async index(request: Request, response: Response){
    const roleRepository = getCustomRepository(RoleRepository);

    const roles = await roleRepository.find();

    return response.status(200).json(roles)
  }
}

export default RoleController;