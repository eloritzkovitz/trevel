import React, { useEffect, useState, useRef, useCallback } from "react";
import postService, { Post as PostType } from "../services/post-service";
import Post from "./Post";

interface PostsListProps {
  userId?: string;
}

const PostsList: React.FC<PostsListProps> = ({ userId }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await postService.getPosts(userId, page);
        setPosts((prevPosts) => {
          // Avoid appending the same posts multiple times
          const newPosts = fetchedPosts.filter(post => !prevPosts.some(p => p._id === post._id));
          return [...prevPosts, ...newPosts];
        });
        setHasMore(fetchedPosts.length > 0);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, page]);

  useEffect(() => {
    // Reset posts and page when userId changes
    setPosts([]);
    setPage(1);
  }, [userId]);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <div ref={lastPostElementRef} key={post._id}>
              <Post title={post.title} content={post.content} sender={post.sender} />
            </div>
          );
        } else {
          return (
            <Post key={post._id} title={post.title} content={post.content} sender={post.sender} />
          );
        }
      })}
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default PostsList;