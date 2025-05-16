import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostEdit {
  id: number;
  title: string;
  body: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<PostEdit | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const updatePost = async (postId: number, updatedPost: PostEdit) => {
    try {
      setUpdateLoading(true);
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const updatedData = await response.json();
      // Find the index of the post to update
      const index = posts.findIndex(post => post.id === postId);
      if (index !== -1) {
        // Create a new array with the updated post
        const newPosts = [...posts];
        newPosts[index] = { ...posts[index], ...updatedData };
        setPosts(newPosts);
      }
      setEditingPost(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost({
      id: post.id,
      title: post.title,
      body: post.body
    });
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const postListStyle = {
    maxWidth: '50rem',
    margin: '0 auto',
    padding: '1.25rem'
  };

  const postItemStyle = {
    backgroundColor: '#f5f5f5',
    borderRadius: '0.5rem',
    padding: '1.25rem',
    marginBottom: '1.25rem',
    boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.1)'
  };

  const postTitleStyle = {
    marginTop: '0',
    color: '#333'
  };

  const postBodyStyle = {
    margin: '0.625rem 0',
    color: '#666'
  };

  const postUserStyle = {
    color: '#999',
    display: 'block'
  };

  return (
    <div style={postListStyle}>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id} style={postItemStyle}>
          {editingPost?.id === post.id ? (
            <div>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost(prev => ({
                  ...prev!,
                  title: e.target.value
                }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              />
              <textarea
                value={editingPost.body}
                onChange={(e) => setEditingPost(prev => ({
                  ...prev!,
                  body: e.target.value
                }))}
                style={{
                  width: '100%',
                  height: '10rem',
                  padding: '0.5rem',
                  marginBottom: '0.5rem'
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => updatePost(post.id, editingPost!)}
                  disabled={updateLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  {updateLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 style={postTitleStyle}>{post.title}</h2>
              <p style={postBodyStyle}>{post.body}</p>
              <small style={postUserStyle}>By User {post.userId}</small>
              <button
                onClick={() => handleEdit(post)}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostList;
