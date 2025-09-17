import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser  from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //! cookie parser middleware
  app.use(cookieParser())

  //! cors middleware
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })


//! App seviyesinde validation pipe tanımladık
//! DTO ları kullandığımız her yerde gelen veriyi kontrol edeceğiz
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //! sadece kabul ettiğimiz değerler
      transform:true, //! format dönüşümü
      forbidNonWhitelisted:true, //! tanımladgmz alanlar dışında bir şey girilirse hata döndürür
    }),
  );



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
