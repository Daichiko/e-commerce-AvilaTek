import { Router } from "express";
import { UserController } from "./users.controller";
import { Route } from "../common/decorators/routes.decorator";
import { authorize } from "../common/decorators/authorize.decorator";
import { UserService } from "./users.service";
import { Controller } from "../common/decorators/controllers.decorator";
import { UserRepositoryPrisma } from "./repositories/UserRepositoryPrisma";
import { VerifyToken } from "../common/decorators/verifyToken.decorator";

@Controller("/users")
export class UsersRoutes {
  public static router: Router;

  protected userRepository = new UserRepositoryPrisma();
  protected userService = new UserService(this.userRepository);
  protected userController = new UserController(this.userService);

  @Route("/", "post")
  postUsuario(req: any, res: any) {
    this.userController.create(req, res);
  }

  @Route("/login", "post")
  postLogin(req: any, res: any) {
    this.userController.login(req, res);
  }

  @VerifyToken()
  @Route("/:id", "put")
  putUsuario(req: any, res: any) {
    this.userController.update(req, res);
  }

  @VerifyToken()
  @Route("/table", "get")
  @authorize(["admin"])
  getUsuarios(req: any, res: any) {
    this.userController.table(req, res);
  }

  @VerifyToken()
  @Route("/:id", "get")
  getUsuarioById(req: any, res: any) {
    this.userController.findById(req, res);
  }

  @VerifyToken()
  @Route("/:id", "delete")
  @authorize(["admin"])
  deleteUsuario(req: any, res: any) {
    this.userController.delete(req, res);
  }

  @VerifyToken()
  @Route("/:id/password", "put")
  async putChangePassword(req: any, res: any) {
    this.userController.changePassword(req, res);
  }
}
