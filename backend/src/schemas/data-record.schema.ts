import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DataRecordDocument = DataRecord & Document;

export enum Department {
  HUMAN_RESOURCES = 'Human Resources',
  IT_IS = 'IT/IS',
  ADMISSION = 'Admission',
  MARKETING = 'Marketing',
}

export enum DataSubjectType {
  EMPLOYEES = 'Employees',
  FACULTY_STAFF = 'Faculty Staff',
  STUDENTS = 'Students',
}

@Schema({ timestamps: true })
export class DataRecord {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: Department })
  department: Department;

  @Prop({ type: [String], enum: DataSubjectType, default: [] })
  dataSubjectTypes: DataSubjectType[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const DataRecordSchema = SchemaFactory.createForClass(DataRecord);
