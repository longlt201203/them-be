import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import ThemConfig from "../etc/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: ThemConfig.JWT_SECRET,
            ignoreExpiration: false,
        });
    }

    async validate(payload: any) {
        const userId = payload.sub;
        const [user, err] = await this.usersService.findOneById(userId);
        if (err) {
            console.log(err);
            throw new UnauthorizedException();
        }
        return user;
    }
}