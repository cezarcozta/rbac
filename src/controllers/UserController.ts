import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import { classToClass } from 'class-transformer';
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';

import UserRepository from '../repositories/UserRepository';
import RoleRepository from '../repositories/RoleRepository';

class UserController {
  async create(request: Request, response: Response) {
    const userRepository = getCustomRepository(UserRepository);
    const roleRepository = getCustomRepository(RoleRepository);

    const { name, cpf, email, password, roles } = request.body;
    
    const image = request.file.filename;
    
    const existsUser = await userRepository.findOne(email);

    if(existsUser){
      return response.status(400).json({message: 'User already exists'});
    }

    const imageFilePath = path.join(uploadConfig.directory, image);

    await fs.promises.stat(imageFilePath);

    const passwordHashed = await hash(password, 8);
    
    const existsRoles = await roleRepository.findByIds(roles);

    const user = userRepository.create({
      name, 
      cpf, 
      email,
      profile_image: image,
      password: passwordHashed,
      roles: existsRoles,
    });

    await userRepository.save(user);

    return response.status(201).json(classToClass(user));
  }

  async index(request: Request, response: Response){
    const userRepository = getCustomRepository(UserRepository);

    const allUsers = await userRepository.find();

    return response.status(200).json(classToClass(allUsers))
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne(id);

    if(!user){
      return response.status(404).json({message: 'User not found!'});
    }

    return response.status(200).json(classToClass(user))
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, cpf, email, image, password } = request.body;

    const userRepository = getCustomRepository(UserRepository);

    const updateUser = await userRepository.findOne(id);

    if(!updateUser){
      return response.status(401).json({message: 'User not found'});
    }

    updateUser.name = name;
    updateUser.cpf = cpf;
    updateUser.email = email;
    updateUser.profile_image = image;
    updateUser.password = password;

    const updatedUser = await userRepository.save(updateUser);

    delete updatedUser.password;

    return response.status(201).json(classToClass(updatedUser))
  }

  // async changeRoles(request: Request, response: Response) {

  // }

  // async desactivate(request: Request, response: Response) {

  // }
}

export default UserController;