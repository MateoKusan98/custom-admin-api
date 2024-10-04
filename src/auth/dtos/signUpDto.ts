import { IsEmail, IsString } from 'class-validator';

export class signUpDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;
}
