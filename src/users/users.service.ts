import { IUserRepository } from "./repositories/IUserRepository";
import {
  CreateUserDto,
  UpdateUserDto,
  loginDto,
  changePasswordDto,
} from "./dto/userDto";
import { validateDto } from "../common/utils/validateDto";
import { ApiError } from "../common/errors/apiError";
import bcrypt from "bcrypt";
import jwt from "../common/utils/jwt";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async create(dto: CreateUserDto) {
    const dtoValidate = await validateDto(CreateUserDto, dto);

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ApiError("El correo ingresado ya existe", 400, []);
    }

    const encriptarPassword = bcrypt.hashSync(dtoValidate.password, 10);

    const sanitizedData: CreateUserDto = {
      ...dtoValidate,
      password: encriptarPassword,
      email: dtoValidate.email.toLowerCase().trim(),
    };

    return this.userRepository.create(sanitizedData);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ApiError("Usuario no encontrado", 400, []);
    }

    return user;
  }

  async findAll(page: number, size: number) {
    if (page <= 0 || size <= 0) {
      throw new ApiError("Los datos de paginacion no son validos", 400, []);
    }

    return this.userRepository.findAll(page, size);
  }

  async update(id: string, dto: UpdateUserDto) {
    const dtoValidate = await validateDto(UpdateUserDto, dto);

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new ApiError(`El usuario no existe`, 404, []);
    }

    const sanitizedData = { ...dtoValidate };

    if (dtoValidate.email) {
      const existingEmail = await this.userRepository.findByEmail(
        dtoValidate.email
      );
      if (existingEmail) {
        throw new ApiError(
          "El nuevo correo electrónico ya está en uso",
          400,
          []
        );
      }
      sanitizedData.email = dtoValidate.email.toLowerCase().trim();
    }

    return this.userRepository.update(id, dtoValidate);
  }

  async login(dto: loginDto) {
    const dtoValidate = await validateDto(loginDto, dto);
    const user = await this.userRepository.findByEmail(dtoValidate.email);

    if (!user) {
      throw new ApiError("El correo no se encuentra registrado", 400, []);
    }

    const validPassword = bcrypt.compareSync(
      dtoValidate.password,
      user.password
    );

    if (!validPassword) {
      throw new ApiError("Contraseña incorrecta", 400, []);
    }

    const roles = user["UserRoles"].map((r) => r.role.name);

    const token: any = jwt.sign({
      id: user.id,
      email: user.email,
      roles: roles,
    });

    return { token, message: "Inicio de sesión satisfactorio" };
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }

  async changePassword(id: string, dto: changePasswordDto) {
    const dtoValidate = await validateDto(changePasswordDto, dto);

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ApiError("Usuario no encontrado", 404, []);
    }

    const encriptarPassword = bcrypt.hashSync(dtoValidate.password, 10);

    await this.userRepository.update(id, { password: encriptarPassword });

    return { message: "Contraseña actualizada exitosamente" };
  }
}
