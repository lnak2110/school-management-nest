import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './common/exceptions/not-found-exception.filter';
import { CustomExceptionFilter } from './common/exceptions/custom-exception.filter';

@Module({
  imports: [ClassesModule, StudentsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
