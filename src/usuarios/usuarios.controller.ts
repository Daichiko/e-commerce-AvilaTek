import { Request, Response } from "express";
import UsuarioService from "./usuarios.service";

export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nombre, email } = req.body;
      const nuevoUsuario = await this.usuarioService.create({ nombre, email });
      return res.status(201).json(nuevoUsuario);
    } catch (error: any) {
      console.error("Error al crear usuario:", error);
      return res
        .status(500)
        .json({ message: "Error al crear usuario", error: error.message });
    }
  }
}
