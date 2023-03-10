import { config } from "dotenv";

if (process.env.NODE_ENV == 'production') {
    config({ path: '.env.deploy' });
} else {
    config();
}

export default class ThemConfig {
    static readonly PORT = parseInt(process.env.PORT || '5000');
    static readonly DB_HOST = process.env.DB_HOST || 'localhost';
    static readonly DB_PORT = parseInt(process.env.DB_PORT || '3306');
    static readonly DB_NAME = process.env.DB_NAME || 'them';
    static readonly DB_USER = process.env.DB_USER || 'root';
    static readonly DB_PASS = process.env.DB_PASS || 'longmetmoivcl';
    static readonly JWT_SECRET = process.env.JWT_SECRET || 'longquametmoi';
    static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
    static readonly GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'longmetmoivcl';
    static readonly SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
    static readonly SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
    static readonly MAILER_USER = process.env.MAILER_USER || 'longmetmoivcl';
    static readonly MAILER_PASS = process.env.MAILER_PASS || 'longmetmoivcl';
    static readonly RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET || 'longmetmoivcl';
    static readonly RESET_PASSWORD_EXPIRES_IN = process.env.RESET_PASSWORD_EXPIRES_IN || '1d';
    static readonly RESET_PASSWORD_URL = process.env.RESET_PASSWORD_URL || 'http://localhost:3000/reset-password';
    static readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'longmetmoivcl';
    static readonly REFRESH_TOKEN_DEFAULT_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    static readonly REFRESH_TOKEN_REMEMBER_EXPIRES_IN  = process.env.REFRESH_TOKEN_REMEMBER_EXPIRES_IN || '30d';
}