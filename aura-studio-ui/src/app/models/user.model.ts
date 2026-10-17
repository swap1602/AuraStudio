export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}
