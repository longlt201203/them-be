import ThemConfig from "../etc/config";
import { DataSource } from "typeorm";
import { resolve } from "path";

const ThemDataSource = new DataSource({
    type: 'mysql',
    host: ThemConfig.DB_HOST,
    port: ThemConfig.DB_PORT,
    database: ThemConfig.DB_NAME,
    username: ThemConfig.DB_USER,
    password: ThemConfig.DB_PASS,
    entities: [resolve(__dirname + '/../**/*.entity{.js,.ts}')],
    migrations: [resolve(__dirname + '/../migrations/*{.js,.ts}')],
    logging: 'all',
    logger: 'advanced-console'
});

console.log(ThemDataSource.options);

export default ThemDataSource;