import { useState, useEffect, useCallback } from 'react';
import { Post, PaginationParams, PaginationState } from '../types/post';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

/**
 * Custom hook to fetch posts with pagination
 * @param initialPage - Starting page number (default: 1)
 * @param pageSize - Number of items per page (default: 10)
 */
export const usePosts = (initialPage = 1, pageSize = 10) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    _page: initialPage,
    _limit: pageSize,
    total: 0,
    totalPages: 0,
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        _page: pagination._page.toString(),
        _limit: pagination._limit.toString(),
      });

      const response = await fetch(`${API_URL}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      // Get total count from headers for pagination
      const total = parseInt(response.headers.get('x-total-count') || '0', 10);
      const totalPages = Math.ceil(total / pagination._limit);

      const data = await response.json();
      
      setPosts(data);
      setPagination(prev => ({
        ...prev,
        total,
        totalPages,
      }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [pagination._page, pagination._limit]);

  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        _page: page,
      }));
    }
  };

  // Fetch posts when pagination changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    pagination,
    goToPage,
  };
};
