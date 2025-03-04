import { FC, useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import userService, { User } from "../services/user-service";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  img: File[];
}

const Signup: FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const inputFileRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [img] = watch(["img"]);
  //const inputFileRef: { current: HTMLInputElement | null } = { current: null };

  // Submit form
  const onSubmit = (data: FormData) => {
    console.log(data);
    const { request } = userService.uploadImage(data.img[0]);
    request.then((response) => {      
      console.log(response.data);
        const user: User = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            profilePicture: response.data.url            
        }        
        const { request } = userService.register(user);
        request.then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.error(error);
        })
    }).catch((error) => {
        console.error(error);
    })
  }

  // Handle file input for image upload
  useEffect(() => {    
    if (img != null && img[0]) {
        setSelectedImage(img[0])
    }
  }, [img]);

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
              <input type="file" className="form-control" {...register("img", { required: true })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Submit</button>
          </form>
        </div>
        <a href="/login">Already have an account?</a>
      </div>
    </div>
  );
};

export default Signup;