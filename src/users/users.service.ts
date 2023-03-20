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

    async createOne(info: CreateUserDto): Promise<[User, any]> {
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
        if (info.phone) {
            const checkPhone = await this.userRepository.findOne({
                where: { phone: info.phone }
            });
            if (checkPhone) {
                err.push({
                    at: 'phone',
                    message: 'Phone number has been used'
                });
            }
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
            avt: info.avt,
            cover: info.cover,
            userAuth: {
                password: info.password ? await this.cryptoService.hashPassword(info.password) : null
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

    async findOneById(id: string, withAuthInfo?: boolean) {
        const user = await this.userRepository.findOne({
            where: { id: id },
            relations: {
                userAuth: withAuthInfo
            }
        });
        return [user, null];
    }

    async findAll() {
        const users = await this.userRepository.find();
        return [users, null];
    }

    async updateProfile(user: User, info: UpdateUserDto) {
        const err = [];
        const checkPhone = await this.userRepository.findOne({
            where: { phone: info.phone }
        });
        if (checkPhone && checkPhone.id !== user.id) {
            err.push({
                at: 'phone',
                message: 'Phone number has been used'
            });
        }
        if (err.length > 0) {
            return [null, err];
        }
        user.address = info.address ?? user.address;
        user.fname = info.fname ?? user.fname;
        user.lname = info.lname ?? user.lname;
        user.zipCode = info.zipCode ?? user.zipCode;
        user.phone = info.phone ?? user.phone;
        user.avt = info.avt;
        user.cover = info.cover;
        const updatedUser = await this.userRepository.save(user);
        return [updatedUser, null];
    }
}
