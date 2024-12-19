import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { ClassesService } from 'src/classes/classes.service';
import { CustomError } from 'src/common/exceptions/custom-error';
import { ErrorCodes } from 'src/common/exceptions/error-codes.enum';

@Injectable()
export class StudentsService {
  private currentStudentId = 0;
  private students: Student[] = [];

  constructor(private readonly classesService: ClassesService) {}

  increaseCurrentStudentId(): number {
    return ++this.currentStudentId;
  }

  create(createStudentDto: CreateStudentDto): Student {
    const studentFound = this.findOneByName(createStudentDto.name);
    if (studentFound) {
      throw new CustomError(
        ErrorCodes.CONFLICT,
        'Student name already exists',
        { field: 'name', value: createStudentDto.name },
      );
    }

    const newStudent = {
      id: this.increaseCurrentStudentId(),
      ...createStudentDto,
    };

    const classFound = this.classesService.findOne(createStudentDto.classId);
    classFound.studentsCount++;
    this.students.push(newStudent);
    return newStudent;
  }

  findAll(): Student[] {
    return this.students;
  }

  findOne(id: number): Student {
    const studentFound = this.students.find((s) => s.id === id);
    if (!studentFound) {
      throw new CustomError(ErrorCodes.NOT_FOUND, 'Student not found', {
        field: 'id',
        value: id,
      });
    }
    return this.students.find((s) => s.id === id);
  }

  findByName(keyword: string): Student[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.students.filter((s) => {
      const lowerName = s.name.toLowerCase();
      return lowerName.indexOf(lowerKeyword) >= 0;
    });
  }

  findOneByName(name: string): Student | undefined {
    return this.students.find(
      (s) => s.name.toLowerCase() === name.toLowerCase(),
    );
  }

  findByClassName(className: string): Student[] {
    const classFound = this.classesService.findOneByName(className);
    if (!classFound) {
      throw new CustomError(ErrorCodes.NOT_FOUND, 'Class not found', {
        field: 'className',
        value: className,
      });
    }
    const classId = classFound.id;
    return this.students.filter((s) => s.classId === classId);
  }

  update(updateStudentDto: UpdateStudentDto): Student {
    const studentToUpdate = this.findOne(updateStudentDto.id);
    if (updateStudentDto?.name) {
      const studentFound = this.findOneByName(updateStudentDto.name);
      if (studentFound && studentFound.id !== studentToUpdate.id) {
        throw new CustomError(
          ErrorCodes.CONFLICT,
          'Student name already exists',
          { field: 'name', value: updateStudentDto.name },
        );
      }
    }
    if (updateStudentDto?.classId) {
      const newClass = this.classesService.findOne(
        updateStudentDto.classId,
        'classId',
      );
      const oldClass = this.classesService.findOne(
        studentToUpdate.classId,
        'classId',
      );
      newClass.studentsCount++;
      oldClass.studentsCount--;
    }
    const { id, ...restData } = updateStudentDto;
    const index = this.students.findIndex((s) => s.id === id);
    this.students[index] = { ...studentToUpdate, ...restData };

    return this.students[index];
  }

  remove(id: number): Student {
    this.findOne(id);
    const index = this.students.findIndex((s) => s.id === id);
    const [removedStudent] = this.students.splice(index, 1);
    const classFound = this.classesService.findOne(
      removedStudent.classId,
      'classId',
    );
    classFound.studentsCount--;
    return removedStudent;
  }
}
