import { MigrationInterface, QueryRunner } from "typeorm";

export class seed1676347450848 implements MigrationInterface {
    name = 'seed1676347450848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_35e7719aa0aaf688491f85c3bb\` ON \`user\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_35e7719aa0aaf688491f85c3bb\` ON \`user\` (\`userAuthId\`)`);
    }

}
