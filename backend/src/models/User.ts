import mongoose from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture?: string;
  _id?: string;
  refreshToken?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  refreshToken: {
    type: [String],
    default: [],
  }
});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;