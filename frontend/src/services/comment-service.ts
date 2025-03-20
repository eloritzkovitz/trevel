import apiClient from "./api-client";
import Cookies from "js-cookie";

// Comment interface
export interface Comment {
  _id: string;
  postId: string;
  content: string; 
  sender: string; 
  senderName: string; 
  senderImage: string; 
  images?: string[]; 
  likes: string[]; 
  likesCount: number; 
  createdAt: string;
}

// Get all comments
const getComments = async (sender?: string, page: number = 1): Promise<Comment[]> => {    
    const response = await apiClient.get<Comment[]>('/comments', { 
        params: { sender, page }
    });
    return response.data;
};

// Get comments by post ID
const getCommentByPostId = async (postId: string): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>(`/comments/post/${postId}`);
  return response.data;
};

// Create a comment
const createComment = async (comment: FormData): Promise<Comment> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    const response = await apiClient.post<Comment>('/comments', comment, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
};
  
// Update a comment                  
const updateComment = async (id: string, comment: FormData): Promise<Comment> => {    
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    const response = await apiClient.put<Comment>(`/comments/${id}`, comment, {
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
  if (!token) throw new Error("No access token found.");

  const response = await apiClient.post<Comment>(`/comments/${id}/like`, { userId }, { 
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Delete a comment  
const deleteComment = async (commentid: string): Promise<void> => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found.");
    }
    await apiClient.delete(`/comments/${commentid}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
};

export default { getComments, getCommentByPostId, createComment, updateComment, likeComment,  deleteComment };