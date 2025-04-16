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

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const usuarios = await this.usuarioService.findAll();
      return res.status(200).json(usuarios);
    } catch (error: any) {
      console.error("Error al obtener usuarios:", error);
      return res
        .status(500)
        .json({ message: "Error al obtener usuarios", error: error.message });
    }
  }
}
