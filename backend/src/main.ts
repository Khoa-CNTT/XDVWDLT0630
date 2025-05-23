import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '..', 'public'));

  // config swagger api
  const config = new DocumentBuilder()
    .setTitle('Vaccination')
    .setDescription('The Vaccination API description')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('appointments')
    .addTag('blog')
    .addTag('bookings')
    .addTag('category-vaccine')
    .addTag('user')
    .addTag('inventory')
    .addTag('manufacturers')
    .addTag('momo')
    .addTag('notifications')
    .addTag('supplier')
    .addTag('tag')
    .addTag('role')
    .addTag('vaccinations')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Swagger | Vaccination',
  });

  // Configure port on Frontend access side
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.get(UserService).initAdminAccount();

  if (!process.env.BASE_URL) {
    process.env.BASE_URL = 'http://localhost:4000';
  }

  await app.listen(process.env.PORT || 3001);
}

bootstrap();
