import { FC, useState } from "react";
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import userService, { User } from "../services/user-service";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { handleGoogleResponse, handleGoogleError } from "../services/google-auth";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;  
}

const Signup: FC = () => {  
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  

  // Submit form
  const onSubmit = (data: FormData) => {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      joinDate: new Date().toISOString()
    };
    const { request: registerRequest } = userService.register(user);
    registerRequest.then(() => {
      navigate('/login'); // Redirect to login page after successful registration
    }).catch((error) => {
      console.error(error);
      setResultMessage("Registration failed. Please try again.");
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
    <div className="container-fluid bg-light min-vh-100">
      <div style={{ textAlign: 'center' }}>
        <h1>Trevel</h1>
        <div className="card panel-form" >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row" style={{ marginTop: '20px' }}>
              <label>Register to join Trevel</label>
              <div className="form-group col-md-6" style={{ marginTop: '20px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  id="inputFirstName" 
                  placeholder="First Name" 
                  {...register("firstName", { required: "Required." })} 
                />
                {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
              </div>
              <div className="form-group col-md-6">
                <input 
                  type="text" 
                  className="form-control" 
                  id="inputLastName" 
                  placeholder="Last Name" 
                  {...register("lastName", { required: "Required." })} 
                />
                {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <input 
                type="email" 
                className="form-control" 
                id="inputEmailAddress" 
                placeholder="Email" 
                {...register("email", { 
                  required: "Required", 
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address. Please enter a valid email address."
                  }
                })} 
              />
              {errors.email && <span className="text-danger">{errors.email.message}</span>}
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <input 
                type="password" 
                className="form-control" 
                id="inputPassword" 
                placeholder="Password" 
                {...register("password", { 
                  required: "Required", 
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long."
                  }
                })} 
              />
              {errors.password && <span className="text-danger">{errors.password.message}</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', marginBottom : '20px' }}>Register</button>
            <GoogleLogin onSuccess={googleResponseMessage} onError={googleErrorMessage} />
          </form>          
        </div>
        <a href="/login">Already have an account?</a>
      </div>
    </div>
  );
};

export default Signup;