import { Request, Response } from "express";
import { RoleService } from "./roles.service";
import ClassErrorHandler from "../common/decorators/classErrorHandler.decorator";

@ClassErrorHandler
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const nuevoRol = await this.roleService.create(req.body);
    return res.status(201).json(nuevoRol);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const rol = await this.roleService.findById(req.params.id);
    return res.status(200).json(rol);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const roles = await this.roleService.findAll();
    return res.status(200).json(roles);
  }

  async table(req: Request, res: Response): Promise<Response> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const size = req.query.size ? parseInt(req.query.size as string, 10) : 10;

    const roles = await this.roleService.table(page, size);
    return res.status(200).json(roles);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await this.roleService.delete(req.params.id);
    return res.status(204).send();
  }

  async assignRoleToUser(req: Request, res: Response): Promise<Response> {
    const result = await this.roleService.assignRoleToUser(req.body);
    return res.status(200).json({
      message: "Rol asignado correctamente al usuario",
      result,
    });
  }

  async removeRoleFromUser(req: Request, res: Response): Promise<Response> {
    await this.roleService.removeRoleFromUser(req.body);
    return res.status(200).json({
      message: "Rol removido correctamente del usuario",
    });
  }

  async findRolesByUser(req: Request, res: Response): Promise<Response> {
    const roles = await this.roleService.findRolesByUser(req.params.userId);
    return res.status(200).json(roles);
  }
}
