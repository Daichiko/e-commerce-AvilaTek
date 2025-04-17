import { Router } from "express";
import { Controller } from "../common/decorators/controllers.decorator";
import { Route } from "../common/decorators/routes.decorator";
import { VerifyToken } from "../common/decorators/verifyToken.decorator";
import { RoleService } from "./roles.service";
import { RoleController } from "./roles.controller";
import { RoleRepositoryPrisma } from "./repositories/RoleRepositoryPrisma";
import { UserRepositoryPrisma } from "../users/repositories/UserRepositoryPrisma";

@Controller("/roles")
export class RolesRoutes {
  public static router: Router;

  protected roleRepository = new RoleRepositoryPrisma();
  protected userRepository = new UserRepositoryPrisma();
  protected roleService = new RoleService(
    this.roleRepository,
    this.userRepository
  );
  protected roleController = new RoleController(this.roleService);

  @VerifyToken()
  @Route("/", "post")
  postRol(req: any, res: any) {
    this.roleController.create(req, res);
  }

  @VerifyToken()
  @Route("/assign", "post")
  assignRoleToUser(req: any, res: any) {
    this.roleController.assignRoleToUser(req, res);
  }

  @VerifyToken()
  @Route("/remove", "post")
  removeRoleFromUser(req: any, res: any) {
    this.roleController.removeRoleFromUser(req, res);
  }

  @VerifyToken()
  @Route("/:id", "delete")
  deleteRol(req: any, res: any) {
    this.roleController.delete(req, res);
  }

  @VerifyToken()
  @Route("/", "get")
  getRoles(req: any, res: any) {
    this.roleController.findAll(req, res);
  }

  @VerifyToken()
  @Route("/by-user/:userId", "get")
  getRolesByUser(req: any, res: any) {
    this.roleController.findRolesByUser(req, res);
  }

  @VerifyToken()
  @Route("/by-id/:id", "get")
  getRolById(req: any, res: any) {
    this.roleController.findById(req, res);
  }
}
