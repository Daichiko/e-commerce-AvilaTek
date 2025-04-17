import { IUserRepository } from "./repositories/IUserRepository";
import { CreateUserDto } from "./dto/CreateUserDto";
import { UpdateUserDto } from "./dto/UpdateUserDto";
import { validateDto } from "../common/utils/validateDto";
import { ApiError } from "../common/errors/apiError";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async create(dto: CreateUserDto) {
    const dtoValidate = await validateDto(CreateUserDto, dto);

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ApiError("El correo ingresado ya existe", 400, []);
    }

    return this.userRepository.create(dtoValidate);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async update(id: string, dto: UpdateUserDto) {
    const dtoValidate = await validateDto(UpdateUserDto, dto);

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ApiError("El correo ingresado ya existe", 400, []);
    }

    return this.userRepository.update(id, dtoValidate);
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }
}
