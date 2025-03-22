import userService from "../services/user-service";
import { CredentialResponse } from "@react-oauth/google";

// Handle Google OAuth response
export const handleGoogleResponse = async (
    credentialResponse: CredentialResponse,
    login: (accessToken: string, refreshToken: string) => void,
    setErrorMessage: (message: string | null) => void,
    navigate: (path: string) => void
  ) => {
    if (credentialResponse.credential) {
      try {
        const response = await userService.signInWithGoogle(credentialResponse.credential);
        const data = await response.request;        
        login(data.data.accessToken, data.data.refreshToken); // Store tokens and update auth state
        navigate('/'); // Redirect to main page after successful login
      } catch (error) {
        console.error(error);
        setErrorMessage("Google login failed. Please try again.");
      }
    }
};

// Handle Google OAuth error
export const handleGoogleError = (setErrorMessage: (message: string | null) => void) => {
    setErrorMessage("Google login failed. Please try again.");
};