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

    async createRandomToken() {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(Math.random().toString(), salt);
        return hash;
    }
}