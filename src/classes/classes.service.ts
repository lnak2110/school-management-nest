import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';
import { CustomError } from 'src/common/exceptions/custom-error';
import { ErrorCodes } from 'src/common/exceptions/error-codes.enum';

@Injectable()
export class ClassesService {
  private currentClassId = 0;
  private classes: Class[] = [];

  increaseCurrentClassId(): number {
    return ++this.currentClassId;
  }

  create(createClassDto: CreateClassDto): Class {
    const classFound = this.findOneByName(createClassDto.name);
    if (classFound) {
      throw new CustomError(ErrorCodes.CONFLICT, 'Class name already exists', {
        field: 'name',
        value: createClassDto.name,
      });
    }

    const newClass = {
      id: this.increaseCurrentClassId(),
      studentsCount: 0,
      ...createClassDto,
    };
    this.classes.push(newClass);
    return newClass;
  }

  findAll(): Class[] {
    return this.classes;
  }

  findByName(keyword: string): Class[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.classes.filter((c) => {
      const lowerName = c.name.toLowerCase();
      return lowerName.indexOf(lowerKeyword) >= 0;
    });
  }

  findOne(id: number, field: string = 'id'): Class {
    const classFound = this.classes.find((c) => c.id === id);

    if (!classFound) {
      throw new CustomError(ErrorCodes.NOT_FOUND, 'Class not found', {
        field,
        value: id,
      });
    }
    return classFound;
  }

  findOneByName(name: string): Class | undefined {
    return this.classes.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
  }

  update(updateClassDto: UpdateClassDto): Class {
    const classToUpdate = this.findOne(updateClassDto.id);
    if (updateClassDto?.name) {
      const classFound = this.findOneByName(updateClassDto.name);
      if (classFound && classFound.id !== classToUpdate.id) {
        throw new CustomError(
          ErrorCodes.CONFLICT,
          'Class name already exists',
          { field: 'name', value: updateClassDto.name },
        );
      }
    }
    const { id, ...restData } = updateClassDto;
    const index = this.classes.findIndex((c) => c.id === id);
    this.classes[index] = { ...classToUpdate, ...restData };
    return this.classes[index];
  }

  remove(id: number): Class {
    const classFound = this.findOne(id);
    if (classFound.studentsCount > 0) {
      throw new CustomError(
        ErrorCodes.BAD_REQUEST_INPUT,
        'Class cannot be removed because it has students',
      );
    }
    const index = this.classes.findIndex((c) => c.id === id);
    const removedClass = this.classes.splice(index, 1);
    return removedClass[0];
  }
}
