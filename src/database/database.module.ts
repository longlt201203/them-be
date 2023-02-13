import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ThemDataSource from "./datasource";

@Module({
    imports: [TypeOrmModule.forRoot(ThemDataSource.options)]
})
export class DatabaseModule {}