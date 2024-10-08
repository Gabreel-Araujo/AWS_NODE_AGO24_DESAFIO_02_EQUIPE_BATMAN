import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserDetailsInterface } from "./interfaces/UserInterface";

@Entity("users")
export default class User implements UserDetailsInterface {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  fullName: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", nullable: true, default: null })
  deletedAt: Date | null;
}
