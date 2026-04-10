// * TData = "Whatever type you need for this specific API call"

import { Request } from "express";
import { User } from './user.types.js'
export interface ApiResult<TData> {
  success: boolean;
  data: TData | null;
  error: string | null;
}

// * Strictly extends the Express Request to include our User payload
export interface AuthRequest extends Request {
  user?: User;
}

// * <TData>
// * The generic parameter TData is just a placeholder – it has no fixed meaning across your whole project. You decide what type it represents at the point of use. This is exactly why generics are powerful: ApiResult stays the same wrapper, but the data field can hold different shapes in different parts of your code.

// * So yes, you can "change" it in every file, every function, or even every variable declaration – they are independent.