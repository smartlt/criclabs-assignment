import { Test, TestingModule } from '@nestjs/testing';
import { DataRecordsController } from './data-records.controller';
import { DataRecordsService } from './data-records.service';
import { CreateDataRecordDto } from './dto/create-data-record.dto';
import { UpdateDataRecordDto } from './dto/update-data-record.dto';
import { QueryDataRecordDto } from './dto/query-data-record.dto';
import { Department, DataSubjectType } from '../schemas/data-record.schema';

// Define proper types for our mocks
interface MockUser {
  _id: string;
  email: string;
  name: string;
}

interface MockRequest {
  user: MockUser;
}

interface MockDataRecord {
  _id: string;
  title: string;
  description: string;
  department: Department;
  dataSubjectTypes: DataSubjectType[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MockPaginatedResult {
  data: MockDataRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface MockDataRecordsService {
  create: jest.Mock;
  findAll: jest.Mock;
  findOne: jest.Mock;
  update: jest.Mock;
  remove: jest.Mock;
}

describe('DataRecordsController', () => {
  let controller: DataRecordsController;
  let mockDataRecordsService: MockDataRecordsService;

  const mockUser: MockUser = {
    _id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockDataRecord: MockDataRecord = {
    _id: 'record123',
    title: 'Test Record',
    description: 'Test Description',
    department: Department.IT_IS,
    dataSubjectTypes: [DataSubjectType.EMPLOYEES],
    createdBy: 'user123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPaginatedResult: MockPaginatedResult = {
    data: [mockDataRecord],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };

  beforeEach(async () => {
    // Create mock service
    mockDataRecordsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataRecordsController],
      providers: [
        {
          provide: DataRecordsService,
          useValue: mockDataRecordsService,
        },
      ],
    }).compile();

    controller = module.get<DataRecordsController>(DataRecordsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new data record', async () => {
      // Arrange
      const createDto: CreateDataRecordDto = {
        title: 'New Record',
        description: 'New Description',
        department: Department.HUMAN_RESOURCES,
        dataSubjectTypes: [DataSubjectType.STUDENTS],
      };
      const mockRequest: MockRequest = { user: mockUser };

      mockDataRecordsService.create.mockResolvedValue(mockDataRecord);

      // Act
      const result = await controller.create(
        createDto,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        mockRequest as any,
      );

      // Assert
      expect(mockDataRecordsService.create).toHaveBeenCalledWith(
        createDto,
        mockUser,
      );
      expect(result).toEqual(mockDataRecord);
    });

    it('should pass the authenticated user to the service', async () => {
      // Arrange
      const createDto: CreateDataRecordDto = {
        title: 'New Record',
        description: 'New Description',
        department: Department.IT_IS,
        dataSubjectTypes: [DataSubjectType.EMPLOYEES],
      };
      const mockRequest: MockRequest = { user: mockUser };

      mockDataRecordsService.create.mockResolvedValue(mockDataRecord);

      // Act
      await controller.create(
        createDto,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        mockRequest as any,
      );

      // Assert
      expect(mockDataRecordsService.create).toHaveBeenCalledWith(
        createDto,
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('should return all data records with pagination', async () => {
      // Arrange
      const query: QueryDataRecordDto = {};
      mockDataRecordsService.findAll.mockResolvedValue(mockPaginatedResult);

      // Act
      const result = await controller.findAll(query);

      // Assert
      expect(mockDataRecordsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle query parameters', async () => {
      // Arrange
      const query: QueryDataRecordDto = {
        title: 'Test',
        page: 1,
        limit: 10,
      };
      mockDataRecordsService.findAll.mockResolvedValue(mockPaginatedResult);

      // Act
      const result = await controller.findAll(query);

      // Assert
      expect(mockDataRecordsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single data record by id', async () => {
      // Arrange
      const recordId = 'record123';
      mockDataRecordsService.findOne.mockResolvedValue(mockDataRecord);

      // Act
      const result = await controller.findOne(recordId);

      // Assert
      expect(mockDataRecordsService.findOne).toHaveBeenCalledWith(recordId);
      expect(result).toEqual(mockDataRecord);
    });
  });

  describe('update', () => {
    it('should update a data record', async () => {
      // Arrange
      const recordId = 'record123';
      const updateDto: UpdateDataRecordDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };
      const updatedRecord: MockDataRecord = { ...mockDataRecord, ...updateDto };

      mockDataRecordsService.update.mockResolvedValue(updatedRecord);

      // Act
      const result = await controller.update(recordId, updateDto);

      // Assert
      expect(mockDataRecordsService.update).toHaveBeenCalledWith(
        recordId,
        updateDto,
      );
      expect(result).toEqual(updatedRecord);
    });
  });

  describe('remove', () => {
    it('should delete a data record', async () => {
      // Arrange
      const recordId = 'record123';
      mockDataRecordsService.remove.mockResolvedValue(mockDataRecord);

      // Act
      const result = await controller.remove(recordId);

      // Assert
      expect(mockDataRecordsService.remove).toHaveBeenCalledWith(recordId);
      expect(result).toEqual(mockDataRecord);
    });
  });
});
