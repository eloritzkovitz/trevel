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
const register = (user: User) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/register',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

// Upload image
const uploadImage = (img: File) => {
    // const abortController = new AbortController()
    const formData = new FormData();
    formData.append("file", img);
    const request = apiClient.post('/file?file=' + img.name, formData, {
        headers: {
            'Content-Type': 'image/*'
        }
    })
    return { request }
}

// Log in
const login = (email: string, password: string) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/login',
        { email, password },
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

export default { register, uploadImage, login }