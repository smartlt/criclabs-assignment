import { IsString, IsOptional, IsArray, IsEnum, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Department, DataSubjectType } from '../../schemas/data-record.schema';

export class QueryDataRecordDto {
  @ApiProperty({
    description: 'Search term for title (partial match, case-insensitive)',
    required: false,
    example: 'employee',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Filter by departments',
    enum: Department,
    isArray: true,
    required: false,
    example: [Department.HUMAN_RESOURCES, Department.IT_IS],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Department, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value as Department];
    }
    return Array.isArray(value) ? (value as Department[]) : [];
  })
  departments?: Department[];

  @ApiProperty({
    description: 'Filter by data subject types',
    enum: DataSubjectType,
    isArray: true,
    required: false,
    example: [DataSubjectType.EMPLOYEES],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DataSubjectType, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value as DataSubjectType];
    }
    return Array.isArray(value) ? (value as DataSubjectType[]) : [];
  })
  dataSubjectTypes?: DataSubjectType[];

  @ApiProperty({
    description: 'Field to sort by',
    enum: [
      'title',
      'description',
      'department',
      'dataSubjectTypes',
      'createdAt',
      'updatedAt',
    ],
    required: false,
    default: 'title',
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'title',
    'description',
    'department',
    'dataSubjectTypes',
    'createdAt',
    'updatedAt',
  ])
  sortField?: string = 'title';

  @ApiProperty({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    required: false,
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortDirection?: 'asc' | 'desc' = 'asc';

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 50,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50;
}
