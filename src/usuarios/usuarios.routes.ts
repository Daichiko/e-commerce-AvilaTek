import { Router } from "express";
import { UsuarioController } from "./usuarios.controller";
import { Route } from "../common/decorators/routes.decorator";
import UsuarioService from "./usuarios.service";
import { Controller } from "../common/decorators/controllers.decorator";

@Controller("/usuarios")
export class usuariosRoutes {
  public static router: Router;
  protected usuarioService = new UsuarioService();
  protected usuarioController = new UsuarioController(this.usuarioService);

  // @VerifyToken()
  @Route("/", "post")
  postusuario(req: any, res: any) {
    this.usuarioController.create(req, res);
  }
}
