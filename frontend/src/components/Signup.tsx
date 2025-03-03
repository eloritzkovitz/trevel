import React from "react";
import userService, { User } from "../services/user-service";

interface FormData {
  email: string
  password: string
  img: File[]
}

const Signup: React.FC = () => {

  // Submit form
  const onSubmit = (data: FormData) => {
    console.log(data)
    const { request } = userService.uploadImage(data.img[0])
    request.then((response) => {
      console.log(response.data)
        const user: User = {
            email: data.email,
            password: data.password,
            avatar: response.data.url            
        }
        const { request } = userService.register(user)
        request.then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.error(error)
        })
    }).catch((error) => {
        console.error(error)
    })
  }

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div style={{ textAlign: 'center' }}>        
        <h1>Trevel</h1>
        <div className="card" style={{ height: '400px', width: '300px', margin: 'auto', padding: '20px', marginTop: '20px', boxShadow: '0px 0px 0px 2px rgba(136, 136, 136, 0.1)' }}>
         <form>
          <div className="form-row" style={{ marginTop: '20px' }}>
              <div className="form-group col-md-6">
                <input type="text" className="form-control" id="inputFirstName" placeholder="First Name" />
              </div>
              <div className="form-group col-md-6">
                <input type="text" className="form-control" id="inputLastName" placeholder="Last Name" />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>            
              <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
            </div>
            <div className="form-group" style={{ marginTop: '20px' }}>           
              <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '50px' }}>Submit</button>
          </form>
        </div>
      </div>
    </div>    
  );
};

export default Signup;