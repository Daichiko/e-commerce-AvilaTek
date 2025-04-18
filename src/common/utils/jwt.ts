import config from "../config/config";
import jwt from "jsonwebtoken";

/**
 * Clase que proporciona métodos para firmar y verificar tokens JWT (JSON Web Token).
 *
 * Utiliza la configuración definida en el archivo `config` para manejar el proceso de generación y validación de tokens JWT.
 *
 * @class Jwt
 */
class Jwt {
  private secret: string;
  private options: jwt.SignOptions;

  /**
   * Crea una instancia de la clase `Jwt` con la configuración necesaria.
   * Obtiene la clave secreta y las opciones de expiración de los tokens desde el archivo de configuración.
   *
   * @constructor
   */
  constructor() {
    this.secret = config.jwtConfig.secretPass as string;
    this.options = {
      expiresIn: config.jwtConfig.expiresIn as string,
    };
  }

  /**
   * Firma un payload y genera un token JWT.
   *
   * Este método recibe un payload, lo firma con la clave secreta y las opciones configuradas,
   * y devuelve un token JWT que puede ser utilizado para autenticar solicitudes.
   *
   * @param payload El contenido del token, que puede ser un objeto, cadena o buffer.
   * @returns Un token JWT firmado.
   *
   * @example
   * const payload = { id: "user123", role: "admin" };
   * const token = jwt.sign(payload);
   * console.log(token); // JWT token generado.
   */
  sign(payload: string | object | Buffer): string {
    return jwt.sign(payload, this.secret, this.options);
  }

  /**
   * Verifica la validez de un token JWT.
   *
   * Este método recibe un token JWT, lo verifica usando la clave secreta configurada,
   * y si es válido, devuelve el contenido decodificado del token.
   *
   * @param token El token JWT a verificar.
   * @returns El contenido del token decodificado si es válido.
   *
   * @throws {JsonWebTokenError} Si el token es inválido o ha expirado.
   *
   * @example
   * const token = "<JWT token>";
   * try {
   *   const decoded = jwt.verify(token);
   *   console.log(decoded); // Información decodificada del token.
   * } catch (error) {
   *   console.error("Token inválido o expirado");
   * }
   */
  verify(token: string): string | object {
    return jwt.verify(token, this.secret);
  }
}

export default new Jwt();
