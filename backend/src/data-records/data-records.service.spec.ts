import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { DataRecordsService } from './data-records.service';
import { DataRecord } from '../schemas/data-record.schema';
import { CreateDataRecordDto } from './dto/create-data-record.dto';
import { UpdateDataRecordDto } from './dto/update-data-record.dto';
import { Department, DataSubjectType } from '../schemas/data-record.schema';
import { UserDocument } from '../schemas/user.schema';

// Define proper types for our mocks
interface MockDataRecordModel {
  find: jest.Mock;
  findById: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
  countDocuments: jest.Mock;
}

describe('DataRecordsService', () => {
  let service: DataRecordsService;
  let mockDataRecordModel: MockDataRecordModel;

  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
  } as UserDocument;

  const mockDataRecord = {
    _id: 'record123',
    title: 'Test Record',
    description: 'Test Description',
    department: Department.IT_IS,
    dataSubjectTypes: [DataSubjectType.EMPLOYEES],
    createdBy: 'user123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockSave = jest.fn().mockResolvedValue(mockDataRecord);

    // Create mock model with constructor function
    const mockConstructor = jest.fn().mockImplementation(() => ({
      save: mockSave,
    }));

    // Create a properly typed mock model
    mockDataRecordModel = Object.assign(mockConstructor, {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataRecordsService,
        {
          provide: getModelToken(DataRecord.name),
          useValue: mockDataRecordModel,
        },
      ],
    }).compile();

    service = module.get<DataRecordsService>(DataRecordsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a data record', async () => {
      const createDto: CreateDataRecordDto = {
        title: 'New Record',
        description: 'New Description',
        department: Department.HUMAN_RESOURCES,
        dataSubjectTypes: [DataSubjectType.STUDENTS],
      };

      const result = await service.create(createDto, mockUser);

      expect(result).toEqual(mockDataRecord);
    });
  });

  describe('findOne', () => {
    it('should return a data record by id', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockDataRecord),
      };
      mockDataRecordModel.findById.mockReturnValue(mockQuery);

      const result = await service.findOne('record123');

      expect(mockDataRecordModel.findById).toHaveBeenCalledWith('record123');
      expect(result).toEqual(mockDataRecord);
    });

    it('should throw NotFoundException if record not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      mockDataRecordModel.findById.mockReturnValue(mockQuery);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a data record', async () => {
      const updateDto: UpdateDataRecordDto = {
        title: 'Updated Title',
      };
      const updatedRecord = { ...mockDataRecord, ...updateDto };

      mockDataRecordModel.findById.mockResolvedValue(mockDataRecord);
      mockDataRecordModel.findByIdAndUpdate.mockResolvedValue(updatedRecord);

      const result = await service.update('record123', updateDto);

      expect(mockDataRecordModel.findById).toHaveBeenCalledWith('record123');
      expect(mockDataRecordModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'record123',
        updateDto,
        { new: true },
      );
      expect(result).toEqual(updatedRecord);
    });

    it('should throw NotFoundException if record not found', async () => {
      mockDataRecordModel.findById.mockResolvedValue(null);

      await expect(service.update('nonexistent', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a data record', async () => {
      mockDataRecordModel.findById.mockResolvedValue(mockDataRecord);
      mockDataRecordModel.findByIdAndDelete.mockResolvedValue(mockDataRecord);

      const result = await service.remove('record123');

      expect(mockDataRecordModel.findById).toHaveBeenCalledWith('record123');
      expect(mockDataRecordModel.findByIdAndDelete).toHaveBeenCalledWith(
        'record123',
      );
      expect(result).toEqual(mockDataRecord);
    });

    it('should throw NotFoundException if record not found for deletion', async () => {
      mockDataRecordModel.findById.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
