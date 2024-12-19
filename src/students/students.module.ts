import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { ClassesModule } from 'src/classes/classes.module';

@Module({
  imports: [ClassesModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
