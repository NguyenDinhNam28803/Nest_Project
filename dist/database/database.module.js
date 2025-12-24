"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = __importDefault(require("mongoose"));
const logger = new common_1.Logger('DatabaseModule');
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const uri = configService.get('MONGODB_URI', 'mongodb://localhost:27017/nest');
                    if (!uri) {
                        logger.error('❌ MongoDB connection string not found in environment variables');
                        throw new Error('MongoDB connection string not found in environment variables');
                    }
                    mongoose_2.default.connection.on('connected', () => {
                        logger.log('✅ Connected to MongoDB successfully');
                    });
                    mongoose_2.default.connection.on('error', (error) => {
                        logger.error(`❌ MongoDB connection error: ${error.message}`);
                    });
                    mongoose_2.default.connection.on('disconnected', () => {
                        logger.warn('ℹ️  MongoDB disconnected');
                    });
                    try {
                        await mongoose_2.default.connect(uri);
                        logger.log('🔄 Attempting to connect to MongoDB...');
                        return { uri };
                    }
                    catch (error) {
                        logger.error(`❌ Failed to connect to MongoDB: ${error.message}`);
                        throw error;
                    }
                },
                inject: [config_1.ConfigService],
            }),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map