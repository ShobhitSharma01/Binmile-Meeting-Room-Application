//import { TypeOrmModuleOptions } from '@nestjs/typeorm';
//import { Booking } from 'src/bookings/entities/booking.entity';
//import { Room } from 'src/rooms/entities/room.entity';
//import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
export const typeOrmModule: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'nestdb',
  synchronize: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
};
export const AppDataSource = new DataSource(typeOrmModule);
