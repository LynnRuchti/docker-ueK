package com.example.demo.domain.blogpost;

import com.example.demo.core.generic.AbstractService;
import com.example.demo.domain.blogpost.dto.BlogPostUpdateDTO;
import com.example.demo.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface BlogPostService extends AbstractService<BlogPost> {

  BlogPost createBlogPost(BlogPost blogPost, User author);

  /**
   * UC2/UC5: Update blog post with validation
   * 
   * @param id        Blog post ID to update
   * @param updateDTO Blog post update data
   * @return Updated blog post
   */
  BlogPost updateBlogPost(UUID id, BlogPostUpdateDTO updateDTO);

  /**
   * UC4: Find all blog posts with pagination, sorting, and optional filtering
   * 
   * @param pageable Pagination and sorting parameters
   * @param category Optional category filter
   * @param authorId Optional author ID filter
   * @return Paginated blog posts
   */
  Page<BlogPost> findAllWithFilters(Pageable pageable, String category, UUID authorId);

}
