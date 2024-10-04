import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  findOneByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  create(email: string, password: string, phone: string, username: string) {
    const user = this.repo.create({
      email,
      password,
      phone,
      username,
    });

    return this.repo.save(user);
  }

  update(user: User) {
    return this.repo.save(user);
  }
}
