import { User, UserWithoutPassword } from "../../common/entities/user.entity";

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<UserWithoutPassword | null>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(): Promise<UserWithoutPassword[] | null>;
}
