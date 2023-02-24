import { Module } from '@nestjs/common';
import { ThemPostsService } from './them-posts.service';
import { ThemPostsController } from './them-posts.controller';
import { ThemPost } from './entities/them-posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ThemPost])],
  controllers: [ThemPostsController],
  providers: [ThemPostsService]
})
export class ThemPostsModule {}
