import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Public } from './auth.guard';
import { AuthService } from './auth.service';
import { signUpDto } from './dtos/signUpDto';
import { signInDto } from './dtos/signInDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: signInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('register')
  signUp(@Body() signUpDto: signUpDto) {
    return this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.phone,
      signUpDto.username,
    );
  }

  @Put('verify-email/:id')
  verifyEmail(@Param('id') id: string, @Body() body: { code: string }) {
    return this.authService.verify(id, body.code);
  }

  @Public()
  @Post('check')
  check(@Body() email: string) {
    return this.authService.check(email);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
