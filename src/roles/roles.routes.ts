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

  /**
   * Ruta para crear un nuevo rol.
   *
   * Requiere autenticación y autorización con rol `dev`.
   *
   * @param req - Objeto de solicitud HTTP con los datos del rol en `body`.
   * @param res - Objeto de respuesta HTTP.
   */
  @VerifyToken()
  @Route("/", "post")
  @authorize(["dev"])
  postRol(req: any, res: any) {
    this.roleController.create(req, res);
  }

  /**
   * Ruta para asignar un rol a un usuario.
   *
   * Requiere autenticación y autorización con rol `admin`.
   *
   * @param req - Objeto de solicitud HTTP con `userId` y `roleId` en `body`.
   * @param res - Objeto de respuesta HTTP.
   */
  @VerifyToken()
  @Route("/assign", "post")
  @authorize(["admin"])
  assignRoleToUser(req: any, res: any) {
    this.roleController.assignRoleToUser(req, res);
  }

  /**
   * Ruta para remover un rol de un usuario.
   *
   * Requiere autenticación y autorización con rol `admin`.
   *
   * @param req - Objeto de solicitud HTTP con `userId` y `roleId` en `body`.
   * @param res - Objeto de respuesta HTTP.
   */
  @VerifyToken()
  @Route("/remove", "post")
  @authorize(["admin"])
  removeRoleFromUser(req: any, res: any) {
    this.roleController.removeRoleFromUser(req, res);
  }

  /**
   * Ruta para obtener todos los roles disponibles.
   *
   * Requiere autenticación y autorización con rol `admin`.
   *
   * @param req - Objeto de solicitud HTTP.
   * @param res - Objeto de respuesta HTTP con la lista de roles.
   */
  @VerifyToken()
  @Route("/", "get")
  @authorize(["admin"])
  getRoles(req: any, res: any) {
    this.roleController.findAll(req, res);
  }

  /**
   * Ruta para obtener roles paginados con filtros.
   *
   * Requiere autenticación y autorización con rol `admin`.
   *
   * @param req - Objeto de solicitud HTTP con `page`, `size`, y filtros como parámetros de consulta.
   * @param res - Objeto de respuesta HTTP con los datos paginados.
   */
  @VerifyToken()
  @Route("/table", "get")
  @authorize(["admin"])
  getRolesTable(req: any, res: any) {
    this.roleController.table(req, res);
  }

  /**
   * Ruta para obtener los roles asignados a un usuario específico.
   *
   * Requiere autenticación y autorización con rol `admin`.
   *
   * @param req - Objeto de solicitud HTTP con el `userId` como parámetro.
   * @param res - Objeto de respuesta HTTP con los roles asignados.
   */
  @VerifyToken()
  @Route("/by-user/:userId", "get")
  @authorize(["admin"])
  getRolesByUser(req: any, res: any) {
    this.roleController.findRolesByUser(req, res);
  }

  /**
   * Ruta para obtener un rol por su ID.
   *
   * Requiere autenticación y autorización con rol `admin`.
   *
   * @param req - Objeto de solicitud HTTP con el `id` como parámetro.
   * @param res - Objeto de respuesta HTTP con el rol encontrado.
   */
  @VerifyToken()
  @Route("/by-id/:id", "get")
  @authorize(["admin"])
  getRolById(req: any, res: any) {
    this.roleController.findById(req, res);
  }
}
