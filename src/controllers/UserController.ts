import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { hash } from 'bcryptjs';

import UserRepository from '../repositories/UserRepository';
import RoleRepository from '../repositories/RoleRepository';

class UserController {
  async create(request: Request, response: Response) {
    const userRepository = getCustomRepository(UserRepository);
    const roleRepository = getCustomRepository(RoleRepository);

    const { name, username, password, roles } = request.body;

    const existsUser = await userRepository.findOne({username});

    if(existsUser){
      return response.status(400).json({message: 'User already exists'});
    }

    const passwordHashed = await hash(password, 8);

    const existsRoles = await roleRepository.findByIds(roles);

    const user = userRepository.create({
      name, 
      username, 
      password: passwordHashed,
      roles: existsRoles,
    });

    await userRepository.save(user);

    delete user.password;

    return response.status(201).json(user);
  }

  async index(request: Request, response: Response){
    const userRepository = getCustomRepository(UserRepository);

    const users = await userRepository.find();

    const allUsers = users.map(user => delete user.password);

    return response.status(200).json(allUsers)
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne(id);

    if(!user){
      return response.status(404).json({message: 'User not found!'});
    }

    delete user.password;

    return response.status(200).json(user)
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, username, password } = request.body;

    const userRepository = getCustomRepository(UserRepository);

    const updateUser = await userRepository.findOne(id);

    if(!updateUser){
      return response.status(401).json({message: 'User not found'});
    }

    updateUser.name = name;
    updateUser.username = username;
    updateUser.password = password;

    const updatedUser = await userRepository.save(updateUser);

    delete updatedUser.password;

    return response.status(201).json(updatedUser)
  }
}

export default UserController;