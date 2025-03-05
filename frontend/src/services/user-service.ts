import apiClient, { CanceledError } from "./api-client";
import Cookies from "js-cookie";

export { CanceledError }

// User interface
export interface User {
    _id?: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    profilePicture?: string
}

// Register a new user
const register = (user: User) => {
    const abortController = new AbortController();
    const request = apiClient.post<User>('/auth/register', user, {
        headers: {
            'Content-Type': 'application/json'
        },
        signal: abortController.signal
    });
    return { request, abort: () => abortController.abort() };
}

// Log in
const login = (email: string, password: string) => {
    const abortController = new AbortController();
    const request = apiClient.post<{ accessToken: string, refreshToken: string }>('/auth/login',
        { email, password },
        { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
}

// Get user data
const getUserData = async (userId?: string): Promise<User> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    const url = userId ? `/auth/user/${userId}` : '/auth/user/';
    const response = await apiClient.get<User>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
};

// Update user data
const updateUser = async (userId: string, formData: FormData): Promise<User> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    const response = await apiClient.put<User>(`/auth/user/${userId}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
};

export default { register, login, getUserData, updateUser };