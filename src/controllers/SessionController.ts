import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import UserRepository from '../repositories/UserRepository';

class SessionController {
  async create(request: Request, response :Response) {
    const {email, password} = request.body;

    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne({email});

    if(!user) {
      return response.status(400).json({error: "User not found"});
    }

    const matchedPassword = await compare(password, user.password);

    if(!matchedPassword) {
      return response.status(400).json({error: "Credentials combination do not match."});
    }

    const token = sign({}, '37569d11b5828848e522c6e47fc0e72a', {
        subject: user.id, 
        expiresIn: '1d',
    });

    delete user.password;

    return response.json({
      user,
      token
    });
  }
}

export default SessionController;