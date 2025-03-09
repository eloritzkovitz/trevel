import React, { useEffect, useState, useRef, useCallback } from "react";
import postService, { Post as PostType } from "../services/post-service";
import Post from "./Post";
import { useAuth } from "../context/AuthContext";
import EditPost from "./EditPost";

interface PostsListProps {
  userId?: string;
}

const PostsList: React.FC<PostsListProps> = ({ userId }) => {
  const { user: loggedInUser } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch posts (memoized to prevent unnecessary re-renders)
  const fetchPosts = useCallback(async () => {
    if (!hasMore || isLoading) return; // Prevent redundant calls

    try {
      setIsLoading(true);
      const fetchedPosts = await postService.getPosts(userId, page);
      
      setPosts((prevPosts) => {
        // Prevent duplicates
        const newPosts = fetchedPosts.filter(post => !prevPosts.some(p => p._id === post._id));
        return [...prevPosts, ...newPosts].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
      });

      setHasMore(fetchedPosts.length > 0);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      setError("Error fetching posts...");
    } finally {
      setIsLoading(false);
    }
  }, [userId, page, hasMore, isLoading]);

  // Load posts when `page` or `userId` changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Reset posts when `userId` changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [userId]);

  // Intersection observer for infinite scrolling
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Handle edit post actions
  const handleEditPost = (post: PostType) => {
    setCurrentPost(post);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentPost(null);
  };

  const handlePostUpdated = () => {
    setShowEditModal(false);
    setCurrentPost(null);
    setPosts([]); // Refresh posts after an update
    setPage(1);
  };

  if (isLoading && posts.length === 0) {
    return <div>Loading posts...</div>;
  }

  if (!isLoading && posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post, index) => {        
        const isOwner = loggedInUser?._id === post.sender;        
        if (posts.length === index + 1) {
          return (
            <div ref={lastPostElementRef} key={post._id}>
              <Post
                title={post.title}
                content={post.content}
                senderName={post.senderName || "Unknown"}
                senderImage={post.senderImage || ""}
                isOwner={isOwner}
                onEdit={() => handleEditPost(post)}
              />
            </div>
          );
        } else {
          return (
            <Post
              key={post._id}
              title={post.title}
              content={post.content}
              senderName={post.senderName || "Unknown"}
              senderImage={post.senderImage || ""}
              isOwner={isOwner}
              onEdit={() => handleEditPost(post)}
            />
          );
        }
      })}
      {/* {isLoading && hasMore && <div>Loading more posts...</div>} */}
      {error && <div className="alert alert-danger">{error}</div>}
      {currentPost && (
        <EditPost
          show={showEditModal}
          handleClose={handleCloseEditModal}
          post={currentPost}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </div>
  );
};

export default PostsList;