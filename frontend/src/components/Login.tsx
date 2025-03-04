import { FC, useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import userService, { User } from "../services/user-service";

interface FormData {  
  email: string;
  password: string;
}

const Login: FC = () => {
  const { handleSubmit } = useForm<FormData>();

  // Submit form
  const onSubmit = (data: FormData) => {
    console.log(data);
    const { request } = userService.login(data.email, data.password);
    request.then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.error(error);
    })
  }
  
  return (
    <div className="container-fluid bg-light min-vh-100">
      <div style={{ textAlign: 'center' }}>
        <h1>Trevel</h1>
        <div className="card" style={{ height: 'auto', width: '300px', margin: 'auto', padding: '20px', marginTop: '20px', boxShadow: '0px 0px 0px 2px rgba(136, 136, 136, 0.1)' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row" style={{ marginTop: '20px' }}>
              <label>Log in</label>              
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Email"/>
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"  />
            </div>            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Submit</button>
          </form>          
        </div>
        <a href="/signup">Don't have an account? Sign up now!</a>
      </div>
    </div>
  );
};

export default Login;