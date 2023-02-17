import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from '../crypto/crypto.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly cryptoService: CryptoService
    ) {}

    async createOne(info: CreateUserDto) {
        const err = [];
        const checkEmail = await this.userRepository.findOne({
            where: { email: info.email }
        });
        if (checkEmail) {
            err.push({
                at: 'email',
                message: 'Email has been used'
            });
        }
        const checkPhone = await this.userRepository.findOne({
            where: { phone: info.phone }
        });
        if (checkPhone) {
            err.push({
                at: 'phone',
                message: 'Phone number has been used'
            });
        }
        if (err.length > 0) {
            return [null, err];
        }
        const user = await this.userRepository.save({
            email: info.email,
            address: info.address,
            fname: info.fname,
            lname: info.lname,
            phone: info.phone,
            zipCode: info.zipCode,
            userAuth: {
                password: await this.cryptoService.hashPassword(info.password)
            }
        });
        return [user, null];
    }

    async findOneByEmailOrPhone(emailOrPhone: string) {
        const user = await this.userRepository.findOne({
            where: [
                { email: emailOrPhone },
                { phone: emailOrPhone }
            ],
            relations: {
                userAuth: true
            }
        });
        return [user, null];
    }

    async findOneById(id: string) {
        const user = await this.userRepository.findOne({
            where: { id: id },
        });
        return [user, null];
    }

    async findAll() {
        const users = await this.userRepository.find();
        return [users, null];
    }

    async updateProfile(user: User, info: UpdateUserDto) {
        user.address = info.address ?? user.address;
        user.fname = info.fname ?? user.fname;
        user.lname = info.lname ?? user.lname;
        user.zipCode = info.zipCode ?? user.zipCode;
        const updatedUser = await this.userRepository.save(user);
        return [updatedUser, null];
    }
}
