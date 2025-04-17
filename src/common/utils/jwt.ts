import config from "../config/config";
import jwt from "jsonwebtoken";

class Jwt {
  private secret: string;
  private options: jwt.SignOptions;

  constructor() {
    this.secret = config.jwtConfig.secretPass as string;
    this.options = {
      expiresIn: config.jwtConfig.expiresIn as string,
    };
  }

  sign(payload: string | object | Buffer): string {
    return jwt.sign(payload, this.secret, this.options);
  }

  verify(token: string): string | object {
    return jwt.verify(token, this.secret);
  }
}

export default new Jwt();
