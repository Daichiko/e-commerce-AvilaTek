import { Request, Response } from "express";
import { UserService } from "./users.service";
import ClassErrorHandler from "../common/decorators/classErrorHandler.decorator";

@ClassErrorHandler
export class UserController {
  /**
   * Constructor del controlador de usuarios.
   *
   * @param userService El servicio de usuarios para interactuar con la lógica de negocio.
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Crea un nuevo usuario.
   *
   * @param req La solicitud HTTP que contiene los datos del nuevo usuario.
   * @param res La respuesta HTTP para enviar la respuesta al cliente.
   * @returns La respuesta HTTP con el nuevo usuario creado.
   */
  async create(req: Request, res: Response): Promise<Response> {
    const nuevoUsuario = await this.userService.create(req.body);
    return res.status(201).json(nuevoUsuario);
  }

  /**
   * Actualiza los datos de un usuario existente.
   *
   * @param req La solicitud HTTP que contiene los datos a actualizar del usuario.
   * @param res La respuesta HTTP para enviar la respuesta al cliente.
   * @returns La respuesta HTTP con el usuario actualizado.
   */
  async update(req: Request, res: Response): Promise<Response> {
    const response = await this.userService.update(req.params.id, req.body);
    return res.status(201).json(response);
  }

  /**
   * Recupera una lista de usuarios con paginación y filtros.
   *
   * @param req La solicitud HTTP que contiene los parámetros de paginación y filtros.
   * @param res La respuesta HTTP para enviar la lista de usuarios al cliente.
   * @returns La respuesta HTTP con los usuarios filtrados y paginados.
   */
  async table(req: Request, res: Response): Promise<Response> {
    const { pageQuery, sizeQuery, ...filter } = req.query;
    const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;
    const size = sizeQuery ? parseInt(sizeQuery as string, 10) : 10;

    const response = await this.userService.table(page, size, filter);
    return res.status(200).json(response);
  }

  /**
   * Encuentra un usuario por su ID.
   *
   * @param req La solicitud HTTP que contiene el ID del usuario a buscar.
   * @param res La respuesta HTTP para enviar el usuario encontrado.
   * @returns La respuesta HTTP con el usuario encontrado.
   */
  async findById(req: Request, res: Response): Promise<Response> {
    const response = await this.userService.findById(req.params.id);

    return res.status(200).json(response);
  }

  /**
   * Realiza el inicio de sesión de un usuario.
   *
   * @param req La solicitud HTTP que contiene las credenciales de inicio de sesión (correo electrónico y contraseña).
   * @param res La respuesta HTTP para enviar el resultado del inicio de sesión (token).
   * @returns La respuesta HTTP con el token de autenticación y el mensaje de éxito.
   */
  async login(req: Request, res: Response): Promise<Response> {
    const response = await this.userService.login(req.body);

    return res.status(200).json(response);
  }

  /**
   * Elimina un usuario por su ID.
   *
   * @param req La solicitud HTTP que contiene el ID del usuario a eliminar.
   * @param res La respuesta HTTP para enviar la confirmación de la eliminación.
   * @returns La respuesta HTTP con el código de estado 204 si el usuario fue eliminado.
   */
  async delete(req: Request, res: Response): Promise<Response> {
    await this.userService.delete(req.params.id);
    return res.status(204).send();
  }

  /**
   * Cambia la contraseña de un usuario.
   *
   * @param req La solicitud HTTP que contiene el nuevo dato de la contraseña.
   * @param res La respuesta HTTP para enviar la confirmación de cambio de contraseña.
   * @returns La respuesta HTTP con el mensaje de éxito.
   */
  async changePassword(req: Request, res: Response) {
    const result = await this.userService.changePassword(
      req.params.id,
      req.body
    );

    return res.status(200).json(result);
  }
}
