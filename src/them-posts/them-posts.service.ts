import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { ThemPost } from './entities/them-posts.entity';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class ThemPostsService {
    constructor(
        @InjectRepository(ThemPost)
        private readonly themPostsRepository: Repository<ThemPost>,
    ) {}

    async findAll() {
        const posts = await this.themPostsRepository.find({
            relations: {
                user: true
            }
        });
        return [posts, null];
    }

    async findOne(id: string) {
        const post = await this.themPostsRepository.findOne({
            where: { id: id },
            relations: {
                user: true
            }
        });
        if (!post) {
            return [null, 'Post not found'];
        }
        return [post, null];
    }
    

    async createOne(user: User, info: CreatePostDto) {
        const post = await this.themPostsRepository.save({
            address: info.address,
            descriptionMedias: info.descriptionMedias,
            descriptionText: info.descriptionText,
            payAmount: info.payAmount,
            payType: info.payType,
            reasons: info.reasons,
            urgent: info.urgent,
            user: { id: user.id },
        });
        return [post, null];
    }

    async updateOne(user: User, id: string, info: UpdatePostDto) {
        const post = await this.themPostsRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                user: true
            }
        });
        if (!post) {
            return [null, 'Post not found'];
        }
        if (post.user.id !== user.id) {
            return [null, 'You are not the owner of this post'];
        }
        post.address = info.address ?? post.address;
        post.descriptionMedias = info.descriptionMedias;
        post.descriptionText = info.descriptionText ?? post.descriptionText;
        post.payAmount = info.payAmount ?? post.payAmount;
        post.payType = info.payType ?? post.payType;
        post.reasons = info.reasons;
        post.urgent = info.urgent ?? post.urgent;
        const updatedPost = await this.themPostsRepository.save(post);
        return [updatedPost, null];
    }
}
