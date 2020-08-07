import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import PermissionRepository from '../repositories/PermissionRepository';

class PermissionController {
  async create(request: Request, response :Response) {
    const permissionRepository = getCustomRepository(PermissionRepository);

    const { level, name, description } = request.body;

    const existsPermission = await permissionRepository.findOne({name});

    if(existsPermission){
      return response.status(400).json({error: 'Permission already exists'});
    }

    const permission = permissionRepository.create({
      level, name, description,
    });

    await permissionRepository.save(permission);

    return response.status(201).json({permission});
  }

  async index(request: Request, response: Response){
    const permissionRepository = getCustomRepository(PermissionRepository);

    const permissions = await permissionRepository.find();

    return response.status(200).json(permissions)
  }
  
}

export default PermissionController;