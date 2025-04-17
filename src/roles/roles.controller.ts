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
    const { pageQuery, sizeQuery, ...filter } = req.query;
    const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;
    const size = sizeQuery ? parseInt(sizeQuery as string, 10) : 10;

    const roles = await this.roleService.table(page, size, filter);
    return res.status(200).json(roles);
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
