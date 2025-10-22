import axiosClient from "./axiosClient";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export const authApi = {
  async login(data: LoginData) {
    const response = await axiosClient.post<LoginResponse>("/auth/login/admin", data);
    return response.data;
  },

  async logout() {
    const response = await axiosClient.post("/auth/logout/admin");
    return response.data;
  },
};
