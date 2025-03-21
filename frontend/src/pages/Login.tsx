import { FC, useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import userService from "../services/user-service";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { handleGoogleResponse, handleGoogleError } from "../services/google-auth";

interface FormData {  
  email: string;
  password: string;
}

const Login: FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submit form
  const onSubmit = (data: FormData) => {
    const { request } = userService.login(data.email, data.password);
    request.then((response) => {      
      login(response.data.accessToken, response.data.refreshToken); // Store tokens and update auth state
      navigate('/'); // Redirect to main page after successful login
    }).catch((error) => {
      console.error(error);
      setErrorMessage("Login failed. Please check your credentials and try again.");
    });
  };

  // Google OAuth response handlers
  const googleResponseMessage = (credentialResponse: CredentialResponse) => {
    handleGoogleResponse(credentialResponse, login, setErrorMessage, navigate);
  };

  const googleErrorMessage = () => {
    handleGoogleError(setErrorMessage);
  };
  
  return (
    <div className="container-fluid min-vh-100">
      <div style={{ textAlign: 'center' }}>
        <h1>Trevel</h1>
        <div className="card panel-form" >
          <form onSubmit={handleSubmit(onSubmit)}>            
            <div className="form-group" style={{ marginTop: '20px' }}>
              <input type="email" className="form-control" id="inputEmail" placeholder="Email" {...register("email", { required: true })} />
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <input type="password" className="form-control" id="inputPassword" placeholder="Password" {...register("password", { required: true })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', marginBottom: '20px' }}>Sign in</button>
            <GoogleLogin onSuccess={googleResponseMessage} onError={googleErrorMessage} />
          </form>
          {errorMessage && (
            <div className="alert alert-danger" style={{ marginTop: '20px' }}>
              {errorMessage}
            </div>
          )}
        </div>
        <a href="/signup">Don't have an account? Sign up now!</a>
      </div>
    </div>
  );
};

export default Login;