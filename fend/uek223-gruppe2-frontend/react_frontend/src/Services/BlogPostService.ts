import api from '../config/Api';
import { BlogPost, BlogPostPageResponse } from '../types/models/BlogPost.model';

/**
 * Query parameters for fetching blog posts with pagination, sorting, and filtering
 */
export interface BlogPostQueryParams {
  page?: number;
  size?: number;
  sortBy?: 'date' | 'title' | 'category';
  sortOrder?: 'asc' | 'desc';
  category?: string;
  authorId?: string;
}

/**
 * BlogPostService - API service for blog post CRUD operations
 * Handles all HTTP requests related to blog posts.
 */
const BlogPostService = {

  /**
   * Creates a new blog post (UC1)
   */
  createBlogPost: (blogPost: BlogPost) => {
    return api.post('/blogpost', blogPost);
  },

  /**
   * Fetches all blog posts with optional pagination, sorting, and filtering (UC4)
   */
  getAllBlogPosts: (params?: BlogPostQueryParams) => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.category) queryParams.append('category', params.category);
      if (params.authorId) queryParams.append('authorId', params.authorId);
    }

    const queryString = queryParams.toString();
    return api.get<BlogPostPageResponse>(`/blogpost${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Fetches a single blog post by ID (UC4)
   */
  getBlogPostById: (id: string) => {
    return api.get(`/blogpost/${id}`);
  },

  /**
   * Updates an existing blog post (UC2, UC5.1)
   */
  updateBlogPost: (id: string, blogPost: BlogPost) => {
    return api.put(`/blogpost/${id}`, blogPost);
  },

  /**
   * Deletes a blog post by ID (UC3, UC5.2)
   */
  deleteBlogPost: (id: string) => {
    return api.delete(`/blogpost/${id}`);
  }
};

export default BlogPostService;

