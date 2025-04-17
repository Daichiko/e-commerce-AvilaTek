import { Request, Response } from "express";
import { UserService } from "./users.service";
import { ApiError } from "../common/errors/apiError";
import ClassErrorHandler from "../common/decorators/classErrorHandler";

@ClassErrorHandler
export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    const nuevoUsuario = await this.userService.create(data);
    return res.status(201).json(nuevoUsuario);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    const nuevoUsuario = await this.userService.update(req.params.id, data);
    return res.status(201).json(nuevoUsuario);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const usuarios = await this.userService.findAll();
    return res.status(200).json(usuarios);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const usuario = await this.userService.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    return res.status(200).json(usuario);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await this.userService.delete(req.params.id);
    return res.status(204).send();
  }
}
