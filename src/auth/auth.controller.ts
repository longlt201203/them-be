import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import CurrentUser from '../decorators/current-user.decorator';
import ResponseObject from '../etc/response-object';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RequestResetPasswordDto } from './dtos/request-reset-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerifyResetPasswordCodeDto } from './dtos/verify-reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
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

    @Get('sign-up-with-google/:credential')
    @ApiParam({ name: 'credential', description: 'Google credential' })
    async signUpWithGoogle(@Param('credential') credential: string) {
        const [token, err] = await this.authService.registerWithGoole(credential);
        if (err) {
            return new ResponseObject(HttpStatus.BAD_REQUEST, 'Sign up with google failed', null, err);
        }
        return new ResponseObject(HttpStatus.OK, 'Sign up with google success', token, null);
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

    @Post('request-reset-password')
    async requestResetPassword(@Body() body: RequestResetPasswordDto) {
        const [user, err] = await this.authService.requestResetPassword(body.email);
        if (err) {
            return new ResponseObject(HttpStatus.BAD_REQUEST, 'Request reset password failed', null, err);
        }
        return new ResponseObject(HttpStatus.OK, 'Request reset password success', user, null);
    }

    @Post('verify-reset-password-code')
    async verifyResetPasswordToken(@Body() body: VerifyResetPasswordCodeDto) {
        const [user, err] = await this.authService.verifyResetPasswordToken(body);
        if (err) {
            return new ResponseObject(HttpStatus.BAD_REQUEST, 'Verify reset password token failed', null, err);
        }
        return new ResponseObject(HttpStatus.OK, 'Verify reset password token success', user, null);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: ResetPasswordDto) {
        const [user, err] = await this.authService.resetPassword(body);
        if (err) {
            return new ResponseObject(HttpStatus.BAD_REQUEST, 'Reset password failed', null, err);
        }
        return new ResponseObject(HttpStatus.OK, 'Reset password success', user, null);
    }

    @Get('get-access-token/:refreshToken')
    @ApiParam({ name: 'refreshToken', description: 'Refresh token' })
    async getAccessToken(@Param('refreshToken') refreshToken: string) {
        const [token, err] = await this.authService.getAccessToken(refreshToken);
        if (err) {
            return new ResponseObject(HttpStatus.BAD_REQUEST, 'Get access token failed', null, err);
        }
        return new ResponseObject(HttpStatus.OK, 'Get access token success', token, null);
    }

    @Get('request-verifying-email')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async requestVerifyingEmail(@CurrentUser() user: User) {
        const [userAuth, err] = await this.authService.requestVerifyEmail(user.email);
        if (err) {
            return new ResponseObject(HttpStatus.BAD_REQUEST, 'Request verifying email failed', null, err);
        }
        return new ResponseObject(HttpStatus.OK, 'Request verifying email success', userAuth, null);
    }

    @Get('verify-email/:code')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async verifyEmail(@CurrentUser() user: User, @Param('code') code: string) {
        const [userAuth, err] = await this.authService.verifyEmail({
            email: user.email,
            code: code,
        });
        if (err) {
            return new ResponseObject(HttpStatus.BAD_REQUEST, 'Verify email failed', null, err);
        }
        return new ResponseObject(HttpStatus.OK, 'Verify email success', userAuth, null);
    }
}
