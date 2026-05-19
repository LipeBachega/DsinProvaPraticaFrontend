import type { IUserRole } from "./customer.type.js";

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponseData {
  token: string;
}

export interface IAuthenticatedUser {
  id: number;
  email: string;
  role: IUserRole;
}
