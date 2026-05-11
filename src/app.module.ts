import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceModule } from './modules/service/service.module';

// (later you will import feature modules here)
// import { LocationModule } from './modules/location/location.module';
import { SchemaModule } from './modules/schema/schema.module';

@Module({
  imports: [
    // Global config
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    //  Database (Neon PostgreSQL)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        //  connection string
        // url: config.get<string>('DATABASE_URL'),
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT') || 5432),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),

        // Auto load entities (from feature modules)
        autoLoadEntities: true,

        //  NEVER true in production
        synchronize: false,

        // Required for Neon (SSL)
        ssl: config.get<string>('DB_SSL') === 'true'
          ? { rejectUnauthorized: false }
          : false,

        // Serverless-safe pooling
        extra: {
          max: 5, // keep small
        },

        // Optional but useful
        logging: true, // turn off in prod later
      }),
    }),

    // Feature modules
    ServiceModule,
    // LocationModule,
    SchemaModule,
  ],
})
export class AppModule {}