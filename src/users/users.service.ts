import { IUserRepository } from "./repositories/IUserRepository";
import { CreateUserDto } from "./dto/createUserDto";
import { UpdateUserDto } from "./dto/updateUserDto";
import { validateDto } from "../common/utils/validateDto";
import { ApiError } from "../common/errors/apiError";
import { loginDto } from "./dto/loginDto";
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

  async findAll() {
    return this.userRepository.findAll();
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
    try {
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

      const token: any = jwt.sign({
        id: user.id,
        email: user.email,
      });

      return { token, message: "Inicio de sesion satisfactorio" };
    } catch (error) {
      throw new ApiError("Error al iniciar sesion", 400, []);
    }
  }

  async delete(id: string) {
    return this.userRepository.delete(id);
  }
}
