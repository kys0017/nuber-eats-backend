import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccoutn({ email, password, role }: CreateAccountInput) {
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        // make error
        return;
      }
      await this.users.save(this.users.create({ email, password, role }));
      return true;
    } catch (error) {
      // make error
      return;
    }

    // check new user
    // create user & hash the password
  }
}
