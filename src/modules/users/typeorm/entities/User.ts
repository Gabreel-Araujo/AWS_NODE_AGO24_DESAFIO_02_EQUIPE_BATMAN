import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import type { UserDetailsInterface } from "./interfaces/UserInterface";

@Entity("users")
export default class User implements UserDetailsInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false })
  fullName: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @Column({ type: "varchar", nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date | null;
}
