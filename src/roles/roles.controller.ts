import { Request, Response } from "express";
import { RoleService } from "./roles.service";
import ClassErrorHandler from "../common/decorators/classErrorHandler.decorator";

@ClassErrorHandler
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Crea un nuevo rol en el sistema.
   *
   * @param req - Objeto de solicitud HTTP que contiene los datos del rol en el cuerpo (`req.body`).
   * @param res - Objeto de respuesta HTTP.
   * @returns Una respuesta HTTP con el rol creado.
   */
  async create(req: Request, res: Response): Promise<Response> {
    const newRole = await this.roleService.create(req.body);
    return res.status(201).json(newRole);
  }

  /**
   * Busca un rol por su ID.
   *
   * @param req - Objeto de solicitud HTTP con el ID del rol en los parámetros (`req.params.id`).
   * @param res - Objeto de respuesta HTTP.
   * @returns Una respuesta HTTP con el rol encontrado.
   */
  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const role = await this.roleService.findById(id);
    return res.status(200).json(role);
  }

  /**
   * Obtiene todos los roles existentes sin paginación.
   *
   * @param req - Objeto de solicitud HTTP.
   * @param res - Objeto de respuesta HTTP.
   * @returns Una respuesta HTTP con la lista de roles.
   */
  async findAll(_: Request, res: Response): Promise<Response> {
    const roles = await this.roleService.findAll();
    return res.status(200).json(roles);
  }

  /**
   * Obtiene una lista de roles con paginación y filtros aplicados.
   *
   * @param req - Objeto de solicitud HTTP con parámetros de consulta (`page`, `size`, y filtros).
   * @param res - Objeto de respuesta HTTP.
   * @returns Una respuesta HTTP con la lista de roles paginada y el total de registros.
   */
  async table(req: Request, res: Response): Promise<Response> {
    const { page = "1", size = "10", ...filter } = req.query;
    const pageNum = parseInt(page as string, 10);
    const sizeNum = parseInt(size as string, 10);

    const roles = await this.roleService.table(pageNum, sizeNum, filter);
    return res.status(200).json(roles);
  }

  /**
   * Asigna un rol a un usuario.
   *
   * @param req - Objeto de solicitud HTTP que contiene `userId` y `roleId` en el cuerpo (`req.body`).
   * @param res - Objeto de respuesta HTTP.
   * @returns Una respuesta HTTP indicando que el rol fue asignado correctamente.
   */
  async assignRoleToUser(req: Request, res: Response): Promise<Response> {
    const result = await this.roleService.assignRoleToUser(req.body);
    return res.status(200).json({
      message: "Rol asignado correctamente al usuario",
      result,
    });
  }

  /**
   * Remueve un rol previamente asignado a un usuario.
   *
   * @param req - Objeto de solicitud HTTP que contiene `userId` y `roleId` en el cuerpo (`req.body`).
   * @param res - Objeto de respuesta HTTP.
   * @returns Una respuesta HTTP indicando que el rol fue removido correctamente.
   */
  async removeRoleFromUser(req: Request, res: Response): Promise<Response> {
    await this.roleService.removeRoleFromUser(req.body);
    return res.status(200).json({
      message: "Rol removido correctamente del usuario",
    });
  }

  /**
   * Obtiene todos los roles asignados a un usuario específico.
   *
   * @param req - Objeto de solicitud HTTP con el ID del usuario en los parámetros (`req.params.userId`).
   * @param res - Objeto de respuesta HTTP.
   * @returns Una respuesta HTTP con la lista de roles del usuario.
   */
  async findRolesByUser(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;
    const roles = await this.roleService.findRolesByUser(userId);
    return res.status(200).json(roles);
  }
}
