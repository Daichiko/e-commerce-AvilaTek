import { IRoleRepository } from "./repositories/IRoleRepository";
import {
  CreateRoleDto,
  UpdateRoleDto,
  AssignRoleToUserDto,
} from "./dto/roleDto";
import { validateDto } from "../common/utils/validateDto";
import { ApiError } from "../common/errors/apiError";
import { IUserRepository } from "users/repositories/IUserRepository";

export class RoleService {
  constructor(
    private roleRepository: IRoleRepository,
    private userRepository: IUserRepository
  ) {}

  async create(dto: CreateRoleDto) {
    const dtoValidated = await validateDto(CreateRoleDto, dto);

    const existing = await this.roleRepository.findByName(dtoValidated.name);
    if (existing) {
      throw new ApiError("Ya existe un rol con ese nombre", 400, []);
    }

    return this.roleRepository.create(dtoValidated);
  }

  async findById(id: string) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new ApiError("Rol no encontrado", 404, []);
    }
    return role;
  }

  async findAll() {
    return this.roleRepository.findAll();
  }

  async table(page: number, size: number) {
    if (page <= 0 || size <= 0) {
      throw new ApiError("Los datos de paginacion no son validos", 400, []);
    }

    return this.roleRepository.table(page, size);
  }

  async delete(id: string) {
    const existing = await this.roleRepository.findById(id);
    if (!existing) {
      throw new ApiError("El rol no existe", 404, []);
    }

    return this.roleRepository.delete(id);
  }

  async assignRoleToUser(dto: AssignRoleToUserDto) {
    const dtoValidated = await validateDto(AssignRoleToUserDto, dto);

    const roleExists = await this.roleRepository.findById(dtoValidated.roleId);
    if (!roleExists) {
      throw new ApiError("El rol especificado no existe", 404, []);
    }

    const userExist = await this.userRepository.findById(dtoValidated.userId);
    if (!userExist) {
      throw new ApiError("El usuario especificado no existe", 404, []);
    }

    const userRoles = await this.roleRepository.findRolesByIds(
      dtoValidated.userId,
      dtoValidated.roleId
    );

    if (userRoles) {
      throw new ApiError("El usuario ya posee dicho rol", 404, []);
    }

    return this.roleRepository.assignRoleToUser(dtoValidated);
  }

  async removeRoleFromUser(dto: AssignRoleToUserDto) {
    const dtoValidated = await validateDto(AssignRoleToUserDto, dto);

    return this.roleRepository.removeRoleFromUser(dtoValidated);
  }

  async findRolesByUser(userId: string) {
    return this.roleRepository.findRolesByUserId(userId);
  }
}
