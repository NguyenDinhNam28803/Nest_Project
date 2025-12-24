import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

const logger = new Logger('DatabaseModule');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/nest');
        
        if (!uri) {
          logger.error('❌ MongoDB connection string not found in environment variables');
          throw new Error('MongoDB connection string not found in environment variables');
        }

        // Set up event listeners on the default connection
        mongoose.connection.on('connected', () => {
          logger.log('✅ Connected to MongoDB successfully');
        });

        mongoose.connection.on('error', (error) => {
          logger.error(`❌ MongoDB connection error: ${error.message}`);
        });

        mongoose.connection.on('disconnected', () => {
          logger.warn('ℹ️  MongoDB disconnected');
        });

        try {
          await mongoose.connect(uri);
          logger.log('🔄 Attempting to connect to MongoDB...');
          return { uri };
        } catch (error) {
          logger.error(`❌ Failed to connect to MongoDB: ${error.message}`);
          throw error;
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
