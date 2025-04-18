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
  /**
   * Router de Express que define las rutas para las operaciones de usuarios.
   */
  public static router: Router;

  /**
   * Repositorio de usuarios que interactúa con la base de datos utilizando Prisma.
   */
  protected userRepository = new UserRepositoryPrisma();

  /**
   * Servicio que contiene la lógica de negocio relacionada con los usuarios.
   */
  protected userService = new UserService(this.userRepository);

  /**
   * Controlador de usuarios que maneja las solicitudes HTTP de usuarios.
   */
  protected userController = new UserController(this.userService);

  /**
   * Ruta para crear un nuevo usuario.
   *
   * @param req La solicitud HTTP que contiene los datos del nuevo usuario.
   * @param res La respuesta HTTP para enviar la confirmación del nuevo usuario.
   * @returns La respuesta HTTP con el nuevo usuario creado.
   */
  @Route("/", "post")
  postUsuario(req: any, res: any) {
    this.userController.create(req, res);
  }

  /**
   * Ruta para iniciar sesión con un usuario.
   *
   * @param req La solicitud HTTP que contiene las credenciales de inicio de sesión.
   * @param res La respuesta HTTP para enviar el resultado del inicio de sesión.
   * @returns La respuesta HTTP con el token de autenticación.
   */
  @Route("/login", "post")
  postLogin(req: any, res: any) {
    this.userController.login(req, res);
  }

  /**
   * Ruta para actualizar un usuario existente.
   * Requiere que el usuario esté autenticado.
   *
   * @param req La solicitud HTTP que contiene el ID del usuario y los nuevos datos.
   * @param res La respuesta HTTP para enviar el usuario actualizado.
   * @returns La respuesta HTTP con el usuario actualizado.
   */
  @VerifyToken()
  @Route("/:id", "put")
  putUsuario(req: any, res: any) {
    this.userController.update(req, res);
  }

  /**
   * Ruta para obtener una lista de usuarios.
   * Requiere que el usuario esté autenticado y tenga el rol de administrador.
   *
   * @param req La solicitud HTTP que contiene los parámetros de paginación y filtros.
   * @param res La respuesta HTTP para enviar la lista de usuarios.
   * @returns La respuesta HTTP con la lista de usuarios.
   */
  @VerifyToken()
  @Route("/table", "get")
  @authorize(["admin"])
  getUsuarios(req: any, res: any) {
    this.userController.table(req, res);
  }

  /**
   * Ruta para obtener los detalles de un usuario por su ID.
   * Requiere que el usuario esté autenticado.
   *
   * @param req La solicitud HTTP que contiene el ID del usuario.
   * @param res La respuesta HTTP para enviar el usuario encontrado.
   * @returns La respuesta HTTP con los datos del usuario.
   */
  @VerifyToken()
  @Route("/:id", "get")
  getUsuarioById(req: any, res: any) {
    this.userController.findById(req, res);
  }

  /**
   * Ruta para eliminar un usuario por su ID.
   * Requiere que el usuario esté autenticado y tenga el rol de administrador.
   *
   * @param req La solicitud HTTP que contiene el ID del usuario a eliminar.
   * @param res La respuesta HTTP para enviar la confirmación de la eliminación.
   * @returns La respuesta HTTP con el código de estado 204 (sin contenido) si la eliminación fue exitosa.
   */
  @VerifyToken()
  @Route("/:id", "delete")
  @authorize(["admin"])
  deleteUsuario(req: any, res: any) {
    this.userController.delete(req, res);
  }

  /**
   * Ruta para cambiar la contraseña de un usuario.
   * Requiere que el usuario esté autenticado.
   *
   * @param req La solicitud HTTP que contiene el ID del usuario y la nueva contraseña.
   * @param res La respuesta HTTP para enviar la confirmación del cambio de contraseña.
   * @returns La respuesta HTTP con el mensaje de éxito.
   */
  @VerifyToken()
  @Route("/:id/password", "put")
  async putChangePassword(req: any, res: any) {
    this.userController.changePassword(req, res);
  }
}
