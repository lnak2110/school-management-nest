import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  UsePipes,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { RemoveClassDto } from './dto/remove-class.dto';
import { CustomExceptionFilter } from 'src/common/exceptions/custom-exception.filter';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';
import { handleError } from 'src/common/utils/handle-error.util';
import { createResponse } from 'src/common/utils/response.util';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { FindByNameDto } from 'src/common/dto/find-by-name.dto';

@Controller('classes')
@UseFilters(CustomExceptionFilter)
@UseGuards(RoleGuard)
@Roles('principal')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @UsePipes(CustomValidationPipe)
  create(@Body() createClassDto: CreateClassDto) {
    try {
      const data = this.classesService.create(createClassDto);
      return createResponse(HttpStatus.CREATED, 'Class created', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Get()
  @Roles('teacher')
  findAll() {
    try {
      const data = this.classesService.findAll();
      return createResponse(HttpStatus.OK, 'Classes found', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Get('name') // ?keyword=
  @Roles('teacher')
  findByName(@Query(new CustomValidationPipe()) query: FindByNameDto) {
    try {
      const data = this.classesService.findByName(query.keyword);
      return createResponse(HttpStatus.OK, 'Classes found', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Get(':id')
  @Roles('teacher')
  @UsePipes(CustomValidationPipe)
  findOne(@Param() { id }: IdParamDto) {
    try {
      const data = this.classesService.findOne(id);
      return createResponse(HttpStatus.OK, 'Class found', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Patch()
  @UsePipes(CustomValidationPipe)
  update(@Body() updateClassDto: UpdateClassDto) {
    try {
      const data = this.classesService.update(updateClassDto);
      return createResponse(HttpStatus.OK, 'Class updated', data);
    } catch (error) {
      handleError(error);
    }
  }

  @Delete()
  @UsePipes(CustomValidationPipe)
  remove(@Body() { id }: RemoveClassDto) {
    try {
      const data = this.classesService.remove(id);
      return createResponse(HttpStatus.OK, 'Class removed', data);
    } catch (error) {
      handleError(error);
    }
  }
}
