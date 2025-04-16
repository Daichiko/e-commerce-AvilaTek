import { Repository } from "typeorm";
import { PostgresConnectionDB } from "../common/config/connectionDB";
import Usuario from "../common/models/usuarios";

interface CreateUsuarioDTO {
  nombre: string;
  email: string;
}

export default class UsuarioService {
  private usuarioRepository: Repository<Usuario>;

  constructor() {
    this.usuarioRepository = PostgresConnectionDB.getRepository(Usuario);
  }

  async create(dto: CreateUsuarioDTO): Promise<Usuario> {
    try {
      const nuevoUsuario = this.usuarioRepository.create(dto);
      return await this.usuarioRepository.save(nuevoUsuario);
    } catch (error: any) {
      // Aquí puedes agregar lógica para manejar errores específicos de la base de datos (ej. email duplicado)
      console.error("Error al guardar usuario:", error);
      throw error;
    }
  }

  async findAll(): Promise<Usuario[]> {
    try {
      return await this.usuarioRepository.find();
    } catch (error: any) {
      console.error("Error al buscar todos los usuarios:", error);
      throw error;
    }
  }
}
