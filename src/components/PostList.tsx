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
