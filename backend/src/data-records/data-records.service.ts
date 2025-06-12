import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { DataRecord, DataRecordDocument } from '../schemas/data-record.schema';
import { CreateDataRecordDto } from './dto/create-data-record.dto';
import { UpdateDataRecordDto } from './dto/update-data-record.dto';
import { UserDocument } from 'src/schemas/user.schema';

interface FilterOptions {
  title?: string;
  department?: string;
  dataSubjectType?: string;
  description?: string;
}

@Injectable()
export class DataRecordsService {
  constructor(
    @InjectModel(DataRecord.name)
    private dataRecordModel: Model<DataRecordDocument>,
  ) {}

  async create(createDataRecordDto: CreateDataRecordDto, user: UserDocument) {
    const dataRecord = new this.dataRecordModel({
      ...createDataRecordDto,
      createdBy: user._id,
    });
    return dataRecord.save();
  }

  async findAll(filters: FilterOptions = {}) {
    const query: FilterQuery<DataRecord> = {};

    // Apply filters
    if (filters.title) {
      query.title = { $regex: filters.title, $options: 'i' };
    }

    if (filters.department) {
      query.department = filters.department;
    }

    if (filters.dataSubjectType) {
      query.dataSubjectTypes = { $in: [filters.dataSubjectType] };
    }

    if (filters.description) {
      query.description = { $regex: filters.description, $options: 'i' };
    }

    return this.dataRecordModel
      .find(query)
      .populate('createdBy', 'name email')
      .exec();
  }

  async findOne(id: string) {
    const dataRecord = await this.dataRecordModel
      .findById(id)
      .populate('createdBy', 'name email')
      .exec();
    if (!dataRecord) {
      throw new NotFoundException('Data record not found');
    }
    return dataRecord;
  }

  async update(
    id: string,
    updateDataRecordDto: UpdateDataRecordDto,
    user: UserDocument,
  ) {
    const dataRecord = await this.dataRecordModel.findById(id);
    const userId = user._id;
    if (!dataRecord) {
      throw new NotFoundException('Data record not found');
    }

    // Check if user owns the record
    if (dataRecord.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only update your own records');
    }

    return this.dataRecordModel.findByIdAndUpdate(id, updateDataRecordDto, {
      new: true,
    });
  }

  async remove(id: string, user: UserDocument) {
    const userId = user._id;
    const dataRecord = await this.dataRecordModel.findById(id);
    if (!dataRecord) {
      throw new NotFoundException('Data record not found');
    }

    // Check if user owns the record
    if (dataRecord.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own records');
    }

    return this.dataRecordModel.findByIdAndDelete(id);
  }
}
