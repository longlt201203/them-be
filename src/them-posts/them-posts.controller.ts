import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import CurrentUser from '../decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import ResponseObject from '../etc/response-object';
import { CreatePostDto } from './dtos/create-post.dto';
import { ThemPostsService } from './them-posts.service';

@Controller('them-posts')
@ApiTags('them-posts')
export class ThemPostsController {
  constructor(private readonly themPostsService: ThemPostsService) {}

  @Get('find-all')
  async findAll() {
    const [posts, err] = await this.themPostsService.findAll();
    if (err) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Error', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Success', posts, null);
  }

  @Get('find-one/:id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const [post, err] = await this.themPostsService.findOne(id);
    if (err) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Error', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Success', post, null);
  }

  @Post('create-one')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createOne(@CurrentUser() user: User, @Body() body: CreatePostDto) {
    const [post, err] = await this.themPostsService.createOne(user, body);
    if (err) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Create post failed', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Create post success', post, null);
  }

  @Post('update-one/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', type: String })
  async updateOne(@CurrentUser() user: User, @Param('id') id: string, @Body() body: CreatePostDto) {
    const [post, err] = await this.themPostsService.updateOne(user, id, body);
    if (err) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Update post failed', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Update post success', post, null);
  }
}
