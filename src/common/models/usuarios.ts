import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("usuarios")
export default class Usuario {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  nombre: string;

  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  email: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha_registro: Date;
}
