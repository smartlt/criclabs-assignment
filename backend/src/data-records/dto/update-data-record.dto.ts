import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Department, DataSubjectType } from '../../schemas/data-record.schema';

export class UpdateDataRecordDto {
  @ApiProperty({
    description: 'Title of the data record',
    example: 'Updated Employee Data Processing',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Description of the data record',
    example:
      'Updated processing of employee personal information for HR purposes',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Department responsible for this data record',
    enum: Department,
    example: Department.IT_IS,
    required: false,
  })
  @IsOptional()
  @IsEnum(Department)
  department?: Department;

  @ApiProperty({
    description: 'Types of data subjects involved',
    enum: DataSubjectType,
    isArray: true,
    example: [DataSubjectType.EMPLOYEES, DataSubjectType.FACULTY_STAFF],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DataSubjectType, { each: true })
  dataSubjectTypes?: DataSubjectType[];
}
