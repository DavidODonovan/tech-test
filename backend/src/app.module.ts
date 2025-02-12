import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsModule } from './sensors/sensors.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mydatabase',
      entities: ['dist/**/*.entity.js'],
      synchronize: true, // auto migration only for use in development do to do this in production!
    }),
    EventEmitterModule.forRoot(),
    SensorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}