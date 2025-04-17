import { Request, Response } from "express";
import { UserService } from "./users.service";
import ClassErrorHandler from "../common/decorators/classErrorHandler.decorator";

@ClassErrorHandler
export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const nuevoUsuario = await this.userService.create(req.body);
    return res.status(201).json(nuevoUsuario);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const response = await this.userService.update(req.params.id, req.body);
    return res.status(201).json(response);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const response = await this.userService.findAll();
    return res.status(200).json(response);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const response = await this.userService.findById(req.params.id);

    return res.status(200).json(response);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const response = await this.userService.login(req.body);

    return res.status(200).json(response);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await this.userService.delete(req.params.id);
    return res.status(204).send();
  }
}
