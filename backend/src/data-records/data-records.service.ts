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
import { QueryDataRecordDto } from './dto/query-data-record.dto';
import { UserDocument } from 'src/schemas/user.schema';

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

  async findAll(queryParams: QueryDataRecordDto) {
    const {
      title,
      departments,
      dataSubjectTypes,
      sortField = 'createdAt',
      sortDirection = 'desc',
      page = 1,
      limit = 50,
    } = queryParams;

    const query: FilterQuery<DataRecord> = {};

    // Apply filters
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (departments && departments.length > 0) {
      query.department = { $in: departments };
    }

    if (dataSubjectTypes && dataSubjectTypes.length > 0) {
      query.dataSubjectTypes = { $in: dataSubjectTypes };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sortField] = sortDirection === 'asc' ? 1 : -1;

    // Execute query with pagination and sorting
    const [data, total] = await Promise.all([
      this.dataRecordModel
        .find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .exec(),
      this.dataRecordModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
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

  async remove(id: string) {
    const dataRecord = await this.dataRecordModel.findById(id);
    if (!dataRecord) {
      throw new NotFoundException('Data record not found');
    }

    return this.dataRecordModel.findByIdAndDelete(id);
  }
}
