import apiClient from "./api-client";
import Cookies from "js-cookie";

// Comment interface
export interface Comment {
  _id?: string;
  postId: string
  title: string;
  content: string;
  sender: string;
  senderName?: string;
  senderImage?: string;
  images?: string[];
  likes?: string[];
  likesCount?: number;
  comments?: Comment[];
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Get all comments
const getComments = async (sender?: string, page: number = 1): Promise<Comment[]> => {    
    const response = await apiClient.get<Comment[]>('/posts', {
        params: { sender, page }
    });
    return response.data;
};

// Get comments by post ID
export const getCommentByPostId = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await apiClient.get<Comment[]>(`/api/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to load comments");
  }
};
// const getCommentByPostId = async (postId: string): Promise<Comment[]> => {
//   const response = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
//   return response.data;
// };

// Create a comment
const createComment = async (post: FormData): Promise<Comment> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    const response = await apiClient.post<Comment>('/posts', post, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
};
  
// Update a comment
const updateComment = async (id: string, post: FormData): Promise<Comment> => {    
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    const response = await apiClient.put<Comment>(`/posts/${id}`, post, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
};

// Like/unlike a comment
const likeComment = async (id: string, userId: string): Promise<Comment> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    const response = await apiClient.post<Comment>(`/posts/${id}/like`, { userId }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
};

// Delete a comment  
const deleteComment = async (id: string, commentId: string): Promise<void> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    await apiClient.delete(`/posts/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
};

export default { getComments, getCommentByPostId, createComment, updateComment, likeComment,  deleteComment };