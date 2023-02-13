import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from '../crypto/crypto.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

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
}
