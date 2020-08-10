import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import UserRepository from '../repositories/UserRepository';
import { classToClass } from 'class-transformer';

class SessionController {
  async create(request: Request, response :Response) {
    const {email, password} = request.body;

    const userRepository = getCustomRepository(UserRepository);

    let user = await userRepository.findOne({email}, {relations: ['roles']});

    if(!user) {
      return response.status(400).json({error: "User not found"});
    }

    const matchedPassword = await compare(password, user.password);

    if(!matchedPassword) {
      return response.status(400).json({error: "Credentials combination do not match."});
    }

    const roles = user.roles.map(role => role.level);
    
    const token = sign({ roles }, '37569d11b5828848e522c6e47fc0e72a', {
        subject: user.id, 
        expiresIn: '1d',
    });

    user = classToClass(user);

    return response.json({user, token});
  }
}

export default SessionController;