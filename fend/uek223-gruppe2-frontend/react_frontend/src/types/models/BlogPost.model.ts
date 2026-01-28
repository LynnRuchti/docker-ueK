import { User } from './User.model';

/**
 * BlogPost - Data model for blog post entities
 * Matches the backend BlogPost entity structure
 */
export type BlogPost = {
  id?: string;
  title: string;
  text: string;
  category: string;
  author?: User;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * BlogPostPageResponse - Paginated response structure for blog post list API
 * Used for implementing pagination in the blog post list view
 */
export type BlogPostPageResponse = {
  content: BlogPost[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
};

