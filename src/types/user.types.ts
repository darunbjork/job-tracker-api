export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RegisterDto = Pick<User, "email" | "name"> & { password: string };
export type LoginDto = Pick<RegisterDto, "email" | "password">;

export interface AuthResponse {
  user: User;
  token: string;
}
