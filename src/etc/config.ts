import { config } from "dotenv";

config();

export default class ThemConfig {
    static readonly PORT = parseInt(process.env.PORT || '5000');
    static readonly DB_HOST = process.env.DB_HOST || 'localhost';
    static readonly DB_PORT = parseInt(process.env.DB_PORT || '3306');
    static readonly DB_NAME = process.env.DB_NAME || 'them';
    static readonly DB_USER = process.env.DB_USER || 'root';
    static readonly DB_PASS = process.env.DB_PASS || 'longmetmoivcl';
    static readonly JWT_SECRET = process.env.JWT_SECRET || 'longquametmoi';
    static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
}