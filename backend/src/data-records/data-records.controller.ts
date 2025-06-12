import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DataRecordsService } from './data-records.service';
import { CreateDataRecordDto } from './dto/create-data-record.dto';
import { UpdateDataRecordDto } from './dto/update-data-record.dto';
import { QueryDataRecordDto } from './dto/query-data-record.dto';
import { UserDocument } from 'src/schemas/user.schema';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('data-records')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
export class DataRecordsController {
  constructor(private readonly dataRecordsService: DataRecordsService) {}

  @Post()
  create(
    @Body() createDataRecordDto: CreateDataRecordDto,
    @Request() req: Request & { user: UserDocument },
  ) {
    return this.dataRecordsService.create(createDataRecordDto, req.user);
  }

  @Get()
  findAll(@Query() query: QueryDataRecordDto) {
    return this.dataRecordsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataRecordsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDataRecordDto: UpdateDataRecordDto,
    @Request() req: Request & { user: UserDocument },
  ) {
    return this.dataRecordsService.update(id, updateDataRecordDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataRecordsService.remove(id);
  }
}
