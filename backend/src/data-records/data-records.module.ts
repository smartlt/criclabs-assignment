import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataRecordsService } from './data-records.service';
import { DataRecordsController } from './data-records.controller';
import { DataRecord, DataRecordSchema } from '../schemas/data-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DataRecord.name, schema: DataRecordSchema },
    ]),
  ],
  controllers: [DataRecordsController],
  providers: [DataRecordsService],
})
export class DataRecordsModule {}
