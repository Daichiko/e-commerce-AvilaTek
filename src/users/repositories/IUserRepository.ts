import { User, UserWithoutPassword } from "../../common/entities/user.entity";

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<UserWithoutPassword>;
  update(id: string, data: Partial<User>): Promise<UserWithoutPassword>;
  delete(id: string): Promise<void>;
  findAll(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: UserWithoutPassword[];
    count: number;
  }>;
}
