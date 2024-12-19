import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
  HttpStatus,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { RemoveClassDto } from 'src/classes/dto/remove-class.dto';
import { FindStudentByNameDto } from './dto/find-student-by-name.dto';
import { ClassesService } from 'src/classes/classes.service';
import { createResponse } from 'src/common/utils/response.util';
import { handleError } from 'src/common/utils/handle-error.util';
import { CustomExceptionFilter } from 'src/common/exceptions/custom-exception.filter';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';
import { FindStudentByClassDto } from './dto/find-student-by.class.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('students')
@UseFilters(CustomExceptionFilter)
@UseGuards(RoleGuard)
@Roles('teacher')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly classesService: ClassesService,
  ) {}

  @Post()
  create(@Body(new CustomValidationPipe()) createStudentDto: CreateStudentDto) {
    try {
      const data = this.studentsService.create(createStudentDto);
      return createResponse(HttpStatus.CREATED, 'Student created', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Get()
  @Roles('principal')
  findAll() {
    try {
      const data = this.studentsService.findAll();
      return createResponse(HttpStatus.OK, 'Students found', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Get('name') // ?keyword=
  @Roles('principal')
  findByName(@Query(new CustomValidationPipe()) query: FindStudentByNameDto) {
    try {
      const data = this.studentsService.findByName(query.keyword);
      return createResponse(HttpStatus.OK, 'Students found', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Get('class/:className')
  @Roles('principal')
  findByClass(@Param() param: FindStudentByClassDto) {
    try {
      const data = this.studentsService.findByClassName(param.className);
      return createResponse(HttpStatus.OK, 'Students found', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Get(':id')
  @Roles('principal')
  findOne(@Param(CustomValidationPipe) param: IdParamDto) {
    try {
      const data = this.studentsService.findOne(param.id);
      return createResponse(HttpStatus.OK, 'Student found', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Patch()
  update(@Body(CustomValidationPipe) updateStudentDto: UpdateStudentDto) {
    try {
      const data = this.studentsService.update(updateStudentDto);
      return createResponse(HttpStatus.OK, 'Student updated', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Delete()
  remove(@Body(CustomValidationPipe) removeClassDto: RemoveClassDto) {
    try {
      const data = this.studentsService.remove(removeClassDto.id);
      return createResponse(HttpStatus.OK, 'Student removed', data);
    } catch (error) {
      handleError(error);
    }
  }
}
