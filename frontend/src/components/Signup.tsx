import { FC, useState } from "react";
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";
import userService, { User } from "../services/user-service";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: File[];
}

const Signup: FC = () => {  
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const profilePicture = watch("profilePicture");
  const navigate = useNavigate();  

  // Submit form
  const onSubmit = (data: FormData) => {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    };
    const { request: registerRequest } = userService.register(user, data.profilePicture[0]);
    registerRequest.then(() => {
      navigate('/login'); // Redirect to login page after successful registration
    }).catch((error) => {
      console.error(error);
      setResultMessage("Registration failed. Please try again.");
    });
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div style={{ textAlign: 'center' }}>
        <h1>Trevel</h1>
        <div className="card" style={{ height: 'auto', width: '300px', margin: 'auto', padding: '20px', marginTop: '20px', boxShadow: '0px 0px 0px 2px rgba(136, 136, 136, 0.1)' }}>
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
            <div className="form-group" style={{ marginTop: '20px' }}>
              <input 
                type="file" 
                className="form-control" 
                {...register("profilePicture", { required: "Uploading a profile picture is required." })} 
              />
              {errors.profilePicture && <span className="text-danger">{errors.profilePicture.message}</span>}
            </div>
            {profilePicture && profilePicture.length > 0 && (
              <div className="form-group" style={{ marginTop: '20px' }}>
                <img 
                  src={URL.createObjectURL(profilePicture[0])} 
                  alt="Profile Preview" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Submit</button>
          </form>
          {resultMessage && (
            <div className="alert alert-info" style={{ marginTop: '20px' }}>
              {resultMessage}
            </div>
          )}
        </div>
        <a href="/login">Already have an account?</a>
      </div>
    </div>
  );
};

export default Signup;