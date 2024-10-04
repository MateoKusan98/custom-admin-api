import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  //   @Column()
  //   emailToken: string;

  //   @Column({ default: false })
  //   emailVerified: boolean;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  //   @OneToMany(() => Report, (report) => report.user)
  //   reports: Report[];
}
