import apiClient from "./api-client";

// Post interface
export interface Post {
  _id?: string;
  title: string;
  content: string;
  sender: string;
  images?: string[];
  likes?: string[];
  likesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Get all posts
const getPosts = async (userId?: string, page: number = 1): Promise<Post[]> => {    
    const response = await apiClient.get<Post[]>('/posts', {
        params: { userId, page }
    });
    return response.data;
};

// Get a post by ID
const getPostById = async (id: string): Promise<Post> => {
  const response = await apiClient.get<Post>(`/posts/${id}`);
  return response.data;
};

// Create a post
const createPost = async (post: FormData): Promise<Post> => {
  const response = await apiClient.post<Post>('/posts', post, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
  
// Update a post
const updatePost = async (id: string, post: FormData): Promise<Post> => {
  const response = await apiClient.put<Post>(`/posts/${id}`, post, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Like/unlike a post
const likePost = async (id: string, userId: string): Promise<Post> => {
    const response = await apiClient.post<Post>(`/posts/${id}/like`, { userId });
    return response.data;
};

// Delete a post  
const deletePost = async (id: string): Promise<void> => {
  await apiClient.delete(`/posts/${id}`);
};
  
export default { getPosts, getPostById, createPost, updatePost, likePost, deletePost };