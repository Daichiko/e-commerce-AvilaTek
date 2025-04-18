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
  /**
   * Constructor del servicio de usuarios.
   *
   * @param userRepository Repositorio de usuarios para interactuar con la base de datos.
   */
  constructor(private userRepository: IUserRepository) {}

  /**
   * Crea un nuevo usuario.
   *
   * @param dto Los datos necesarios para crear un usuario.
   * @returns El usuario creado.
   * @throws ApiError Si el correo electrónico ya está registrado.
   */
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

  /**
   * Encuentra un usuario por su ID.
   *
   * @param id El ID del usuario a buscar.
   * @returns El usuario encontrado.
   * @throws ApiError Si el usuario no se encuentra.
   */
  async findById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ApiError("Usuario no encontrado", 400, []);
    }

    return user;
  }

  /**
   * Recupera una lista de usuarios con paginación y filtro opcional.
   *
   * @param page El número de página para la paginación.
   * @param size El número de elementos por página.
   * @param filter Los filtros aplicados a la búsqueda (por ejemplo, "nombre" o "email").
   * @returns Un objeto con los usuarios y el conteo total.
   * @throws ApiError Si los parámetros de paginación no son válidos.
   */
  async table(page: number, size: number, filter: any) {
    if (page <= 0 || size <= 0) {
      throw new ApiError("Los datos de paginacion no son validos", 400, []);
    }

    return this.userRepository.table(page, size, filter);
  }

  /**
   * Actualiza la información de un usuario.
   *
   * @param id El ID del usuario a actualizar.
   * @param dto Los datos a actualizar.
   * @returns El usuario actualizado.
   * @throws ApiError Si el usuario no existe o si el correo electrónico ya está en uso.
   */
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

  /**
   * Realiza el inicio de sesión de un usuario.
   *
   * @param dto Los datos de inicio de sesión (correo electrónico y contraseña).
   * @returns Un objeto con el token JWT y el mensaje de éxito.
   * @throws ApiError Si el correo no está registrado o si la contraseña es incorrecta.
   */
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

  /**
   * Elimina un usuario por su ID.
   *
   * @param id El ID del usuario a eliminar.
   * @returns Void, no retorna nada.
   */
  async delete(id: string) {
    return this.userRepository.delete(id);
  }

  /**
   * Cambia la contraseña de un usuario.
   *
   * @param id El ID del usuario cuya contraseña se va a cambiar.
   * @param dto Los nuevos datos de la contraseña.
   * @returns Un objeto con el mensaje de éxito.
   * @throws ApiError Si el usuario no existe.
   */
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
