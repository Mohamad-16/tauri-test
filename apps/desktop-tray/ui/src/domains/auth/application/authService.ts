import type { LoginRequest, User } from "../types/auth";

export class AuthService {
  async login(payload: LoginRequest): Promise<User> {
    const validEmail = "admin@fluxbooks.com";
    const validPassword = "Password@123";

    if (payload.email !== validEmail || payload.password !== validPassword) {
      throw new Error("Invalid email or password");
    }

    document.cookie = "fluxbooks_session=authenticated; path=/; SameSite=Strict";

    return {
      name: "FluxBooks Admin",
      email: validEmail,
      role: "Administrator",
    };
  }
}

export const authService = new AuthService();
