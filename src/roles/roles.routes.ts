import { Router } from "express";
import { Controller } from "../common/decorators/controllers.decorator";
import { Route } from "../common/decorators/routes.decorator";
import { VerifyToken } from "../common/decorators/verifyToken.decorator";
import { RoleService } from "./roles.service";
import { RoleController } from "./roles.controller";
import { RoleRepositoryPrisma } from "./repositories/RoleRepositoryPrisma";
import { UserRepositoryPrisma } from "../users/repositories/UserRepositoryPrisma";
import { authorize } from "../common/decorators/authorize.decorator";

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
  @authorize(["dev"])
  postRol(req: any, res: any) {
    this.roleController.create(req, res);
  }

  @VerifyToken()
  @Route("/assign", "post")
  @authorize(["admin"])
  assignRoleToUser(req: any, res: any) {
    this.roleController.assignRoleToUser(req, res);
  }

  @VerifyToken()
  @Route("/remove", "post")
  @authorize(["admin"])
  removeRoleFromUser(req: any, res: any) {
    this.roleController.removeRoleFromUser(req, res);
  }

  @VerifyToken()
  @Route("/", "get")
  @authorize(["admin"])
  getRoles(req: any, res: any) {
    this.roleController.findAll(req, res);
  }

  @VerifyToken()
  @Route("/table", "get")
  @authorize(["admin"])
  getRolesTable(req: any, res: any) {
    this.roleController.table(req, res);
  }

  @VerifyToken()
  @Route("/by-user/:userId", "get")
  @authorize(["admin"])
  getRolesByUser(req: any, res: any) {
    this.roleController.findRolesByUser(req, res);
  }

  @VerifyToken()
  @Route("/by-id/:id", "get")
  @authorize(["admin"])
  getRolById(req: any, res: any) {
    this.roleController.findById(req, res);
  }
}
