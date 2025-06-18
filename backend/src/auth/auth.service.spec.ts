import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Define proper types for our mocks
interface MockUserModel {
  findOne: jest.Mock;
  findById: jest.Mock;
  new: jest.Mock;
}

interface MockUser {
  _id: string;
  email: string;
  name: string;
  password: string;
  save: jest.Mock;
}

interface MockJwtService {
  sign: jest.Mock;
}

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: MockUserModel;
  let mockJwtService: MockJwtService;

  const mockUser: MockUser = {
    _id: 'user123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    save: jest.fn(),
  };

  const mockAuthResponse = {
    access_token: 'mock-jwt-token',
    user: {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
    },
  };

  beforeEach(async () => {
    // Mock bcrypt functions
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123' as never);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    // Create mock user model with constructor function
    const mockConstructor = jest.fn().mockImplementation(() => ({
      ...mockUser,
      save: jest.fn().mockResolvedValue(mockUser),
    }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mockUserModel = Object.assign(mockConstructor, {
      findOne: jest.fn(),
      findById: jest.fn().mockReturnValue({
        select: jest.fn(),
      }),
    }) as any;

    // Create mock JWT service
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should successfully register a new user', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(null);

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: registerDto.email,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: mockUser._id,
        email: mockUser.email,
      });
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw ConflictException when user already exists', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: registerDto.email,
      });
    });

    it('should hash password with salt rounds of 12', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(null);

      // Act
      await service.register(registerDto);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
    });

    it('should generate JWT token with correct payload', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(null);

      // Act
      await service.register(registerDto);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: mockUser._id,
        email: mockUser.email,
      });
    });

    it('should not include password in response', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(null);

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result.user).not.toHaveProperty('password');
      expect(result.user).toEqual({
        id: mockUser._id,
        email: mockUser.email,
        name: mockUser.name,
      });
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: mockUser._id,
        email: mockUser.email,
      });
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: loginDto.email,
      });
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
    });

    it('should not include password in response', async () => {
      // Arrange
      mockUserModel.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result.user).not.toHaveProperty('password');
      expect(result.user).toEqual({
        id: mockUser._id,
        email: mockUser.email,
        name: mockUser.name,
      });
    });
  });

  describe('validateUser', () => {
    it('should return user without password when user exists', async () => {
      // Arrange
      const userWithoutPassword = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(userWithoutPassword),
      };
      mockUserModel.findById.mockReturnValue(mockQuery);

      // Act
      const result = await service.validateUser('user123');

      // Assert
      expect(mockUserModel.findById).toHaveBeenCalledWith('user123');
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(result).toEqual(userWithoutPassword);
    });

    it('should return null when user does not exist', async () => {
      // Arrange
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null),
      };
      mockUserModel.findById.mockReturnValue(mockQuery);

      // Act
      const result = await service.validateUser('nonexistent');

      // Assert
      expect(mockUserModel.findById).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle database errors during registration', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      mockUserModel.findOne.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should handle database errors during login', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockUserModel.findOne.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
