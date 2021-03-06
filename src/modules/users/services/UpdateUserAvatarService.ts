import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can update an avatar.', 401);
    }

    if (user.avatar) {
      const userAvatarPath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarExists = await fs.promises.stat(userAvatarPath);

      if (userAvatarExists) {
        await fs.promises.unlink(userAvatarPath);
      }
    }

    user.avatar = avatarFileName;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
