import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import ThemConfig from './etc/config';
import { ThemValidationPipe } from './etc/them-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Them APIs')
    .setDescription('APIs for project Them')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ThemValidationPipe()
  );

  app.enableCors();
  await app.listen(ThemConfig.PORT);
}
bootstrap();
