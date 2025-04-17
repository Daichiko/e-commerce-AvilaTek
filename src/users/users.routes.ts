import { Router } from "express";
import { UserController } from "./users.controller";
import { Route } from "../common/decorators/routes.decorator";
import { UserService } from "./users.service";
import { Controller } from "../common/decorators/controllers.decorator";
import { UserRepositoryPrisma } from "./repositories/UserRepositoryPrisma.ts";

@Controller("/users")
export class UsersRoutes {
  public static router: Router;

  protected repo = new UserRepositoryPrisma();
  protected userService = new UserService(this.repo);
  protected userController = new UserController(this.userService);

  @Route("/", "post")
  postUsuario(req: any, res: any) {
    this.userController.create(req, res);
  }

  @Route("/:id", "put")
  putUsuario(req: any, res: any) {
    this.userController.update(req, res);
  }

  @Route("/", "get")
  getUsuarios(req: any, res: any) {
    this.userController.findAll(req, res);
  }

  @Route("/:id", "get")
  getUsuarioById(req: any, res: any) {
    this.userController.findById(req, res);
  }

  @Route("/:id", "delete")
  deleteUsuario(req: any, res: any) {
    this.userController.delete(req, res);
  }
}
