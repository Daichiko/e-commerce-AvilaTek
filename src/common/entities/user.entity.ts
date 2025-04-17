export class User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  fechaCreacion: Date;
}

export type UserWithoutPassword = Omit<User, "password">;
