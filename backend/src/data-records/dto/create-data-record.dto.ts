import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Department, DataSubjectType } from '../../schemas/data-record.schema';

export class CreateDataRecordDto {
  @ApiProperty({
    description: 'Title of the data record',
    example: 'Employee Data Processing',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the data record',
    example: 'Processing of employee personal information for HR purposes',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Department responsible for this data record',
    enum: Department,
    example: Department.HUMAN_RESOURCES,
  })
  @IsEnum(Department)
  department: Department;

  @ApiProperty({
    description: 'Types of data subjects involved',
    enum: DataSubjectType,
    isArray: true,
    example: [DataSubjectType.EMPLOYEES],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DataSubjectType, { each: true })
  dataSubjectTypes?: DataSubjectType[];
}
