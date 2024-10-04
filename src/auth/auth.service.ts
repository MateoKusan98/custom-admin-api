import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async check(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      return true;
    }
    return false;
  }

  async verify(id: string, code: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // if (code === user.emailToken) {
    //   user.emailVerified = true;
    // }

    return Boolean(this.usersService.update(user));
  }

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(pass, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      // emailVerified: user.emailVerified,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    email: string,
    password: string,
    phone: string,
    username: string,
  ) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    // const emailToken = this.generateVerificationToken();

    const user = await this.usersService.create(
      email,
      result,
      phone,
      username,
      // emailToken,
    );

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      // emailVerified: user.emailVerified,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // generateVerificationToken() {
  //   const min = 1000; // Minimum 4-digit number
  //   const max = 9999; // Maximum 4-digit number
  //   const token = Math.floor(Math.random() * (max - min + 1)) + min;

  //   return token.toString(); // Convert the number to a string
  // }
}
