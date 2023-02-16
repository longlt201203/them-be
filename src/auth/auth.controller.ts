import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import CurrentUser from '../decorators/current-user.decorator';
import ResponseObject from '../etc/response-object';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    async login(@Body() body: LoginDto) {
        const [token, err] = await this.authService.login(body);
        if (err) {
            return new ResponseObject(HttpStatus.BAD_REQUEST, 'Login failed', null, err);
        }
        return new ResponseObject(HttpStatus.OK, 'Login success', token, null);
    }

    @Get('self')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async self(@CurrentUser() user: User) {
        return new ResponseObject(HttpStatus.OK, 'Get self success', user, null);
    }

    @Get('get-info-from-google/:credential')
    @ApiParam({ name: 'credential', description: 'Google credential' })
    async getInfoFromGoogle(@Param('credential') credential: string) {
        const [payload, err] = await this.authService.getInfoFromGoogle(credential);
        if (err) {
            return new ResponseObject(HttpStatus.BAD_REQUEST, 'Get info from google failed', null, err);
        }
        return new ResponseObject(HttpStatus.OK, 'Get info from google success', payload, null);
    }

    @Get('login-with-google/:credential')
    @ApiParam({ name: 'credential', description: 'Google credential' })
    async loginWithGoogle(@Param('credential') credential: string) {
        const [token, err] = await this.authService.loginWithGoogle(credential);
        if (err) {
            return new ResponseObject(HttpStatus.BAD_REQUEST, 'Login with google failed', null, err);
        }
        return new ResponseObject(HttpStatus.OK, 'Login with google success', token, null);
    }
}
