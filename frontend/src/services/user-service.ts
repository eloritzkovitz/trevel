import apiClient, { CanceledError } from "./api-client";

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
const register = (user: User, img: File) => {
    const formData = new FormData();
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("profilePicture", img);

    const abortController = new AbortController();
    const request = apiClient.post<User>('/auth/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
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

export default { register, login }