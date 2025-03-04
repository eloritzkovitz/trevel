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
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [profilePicture] = watch(["profilePicture"]);
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
                <input type="text" className="form-control" id="inputFirstName" placeholder="First Name" {...register("firstName", { required: true })} />
              </div>
              <div className="form-group col-md-6">
                <input type="text" className="form-control" id="inputLastName" placeholder="Last Name" {...register("lastName", { required: true })} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" {...register("email", { required: true })} />
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" {...register("password", { required: true })} />
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <input type="file" className="form-control" {...register("profilePicture", { required: true })} />
            </div>
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