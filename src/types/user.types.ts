// * User is what we send back to the frontend - no password for safety.
// * RegisterDto is what we expect from the frontend when signing up - it includes password.
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// ! Pick — Select only specific properties
// * RegisterDto = take "email" and "name" from User, then add "password" as an extra field. 
export type RegisterDto = Pick<User, "email" | "name"> & { password: string }; // ! password is a TypeScript type definition
export type LoginDto = Pick<RegisterDto, "email" | "password">;

export interface AuthResponse {
  user: User;
  token: string;
}
