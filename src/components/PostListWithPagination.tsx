import React from 'react';
import { usePosts } from '../hooks/usePosts';
import { Post } from '../types/post';

const PostListWithPagination: React.FC = () => {
  const { posts, loading, error, pagination, goToPage } = usePosts();

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Posts</h1>
      
      {/* Posts List */}
      <div className="space-y-6 mb-8">
        {posts.map((post: Post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h2>
            <p className="text-gray-600">{post.body}</p>
            <div className="mt-3 text-sm text-gray-500">
              Post ID: {post.id} • User ID: {post.userId}
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => goToPage(pagination._page - 1)}
          disabled={pagination._page === 1}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        
        <span className="px-4 py-2 text-gray-700">
          Page {pagination._page} of {pagination.totalPages || 1}
        </span>
        
        <button
          onClick={() => goToPage(pagination._page + 1)}
          disabled={pagination._page === pagination.totalPages}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      
      {/* Loading indicator for subsequent page loads */}
      {loading && posts.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full p-3">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default PostListWithPagination;
