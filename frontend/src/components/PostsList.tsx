import React, { useEffect, useState, useRef, useCallback } from "react";
import postService, { Post as PostType } from "../services/post-service";
import Post from "./Post";
import { useAuth } from "../context/AuthContext";
import EditPost from "./EditPost";

interface PostsListProps {
  userId?: string;
  refresh: boolean;
}

const PostsList: React.FC<PostsListProps> = ({ userId, refresh }) => {
  const { user: loggedInUser } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch posts when page changes
  useEffect(() => {
    const fetchPosts = async () => {
      if (!hasMore || isLoading) return;

      try {
        setIsLoading(true);
        const fetchedPosts = await postService.getPosts(userId, page);

        setPosts((prevPosts) => {
          const newPosts = fetchedPosts.filter(
            (post) => !prevPosts.some((p) => p._id === post._id)
          );
          return [...prevPosts, ...newPosts].sort(
            (a, b) =>
              new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
          );
        });

        setHasMore(fetchedPosts.length > 0);
      } catch (error) {
        console.error("Failed to fetch posts", error);
        setError("Error fetching posts...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, userId, refresh]);

  // Reset when userId changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [userId, refresh]);

  // Infinite scrolling observer
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Edit post handlers
  const handleEditPost = (post: PostType) => {
    setCurrentPost(post);
    setShowEditModal(true);    
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentPost(null);
  };

  const handlePostUpdated = (updatedPost: PostType) => {
    setShowEditModal(false);
    setCurrentPost(null);    
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  // Delete post handler
  const handleDeletePost = async (post: PostType) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postService.deletePost(post._id!);
        setPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
      } catch (error) {
        console.error("Failed to delete post", error);
      }
    }
  };

  if (isLoading && posts.length === 0) {
    return <div>Loading posts...</div>;
  }

  if (!isLoading && posts.length === 0) {
    return (
      <div className="card mb-2 panel-posts">
        <p>No posts available</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {posts.map((post, index) => {
        const isOwner = loggedInUser?._id === post.sender;

        return (
          <div ref={index === posts.length - 1 ? lastPostRef : null} key={post._id}>
            <Post
              _id={post._id}
              title={post.title}
              content={post.content}
              sender={post.sender}
              senderName={post.senderName || "Unknown"}
              senderImage={post.senderImage || ""}
              images={post.images}
              likes={post.likes || []}
              likesCount={post.likesCount || 0}
              comments={post.comments || []}
              commentsCount={post.commentsCount || 0}
              createdAt={post.createdAt || ""}
              isOwner={isOwner}
              onEdit={() => handleEditPost(post)}              
              onDelete={() => handleDeletePost(post)}
            />
          </div>
        );
      })}
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