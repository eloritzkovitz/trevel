import React, { useEffect, useState } from "react";
import Post from "./Post";

interface Post {
  _id: string;
  title: string;
  content: string;
  sender: string;
}

interface PostsListProps {
  userId?: string;
}

const PostsList: React.FC<PostsListProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let fetchedPosts;
        if (userId) {
          //fetchedPosts = await postService.getUserPosts(userId);
        } else {
          //fetchedPosts = await postService.getAllPosts();
        }
        //setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post) => (
        <Post key={post._id} title={post.title} content={post.content} sender={post.sender} />
      ))}
    </div>
  );
};

export default PostsList;