import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class CryptoService {
    async validatePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    randomNumberCode(length: number) {
        const seed = "0123456789";
        let code = "";
        for (let i = 0; i < length; i++) {
            code += seed[Math.floor(Math.random() * seed.length)];
        }
        return code;
    }
}