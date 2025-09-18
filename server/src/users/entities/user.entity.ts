import { Booking } from 'src/bookings/entities/booking.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export type UserRole = 'admin' | 'manager' | 'employee';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => Booking, (booking) => booking.user, { cascade: true })
  bookings: Booking[];
}
