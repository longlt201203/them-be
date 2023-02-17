import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import CurrentUser from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import ResponseObject from '../etc/response-object';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post('create-one')
  async createOne(@Body() info: CreateUserDto) {
    const [user, err] = await this.usersService.createOne(info);
    if (err) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Create account failed', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Create account successfully', user, null);
  }

  @Get('find-all')
  async findAll() {
    const [users, err] = await this.usersService.findAll();
    if (err) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Get all users failed', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Get all users successfully', users, null);
  }

  @Post('update-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(@Body() info: UpdateUserDto, @CurrentUser() user: User) {
    const [updatedUser, err] = await this.usersService.updateProfile(user, info);
    if (err) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Update profile failed', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Update profile successfully', updatedUser, null);
  }
}
