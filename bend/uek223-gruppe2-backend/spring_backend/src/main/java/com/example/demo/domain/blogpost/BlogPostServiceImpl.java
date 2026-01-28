package com.example.demo.domain.blogpost;

import com.example.demo.core.generic.AbstractServiceImpl;
import com.example.demo.domain.blogpost.dto.BlogPostUpdateDTO;
import com.example.demo.domain.user.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class BlogPostServiceImpl extends AbstractServiceImpl<BlogPost> implements BlogPostService {

  private final BlogPostRepository blogPostRepository;

  @Autowired
  public BlogPostServiceImpl(BlogPostRepository repository) {
    super(repository);
    this.blogPostRepository = repository;
  }

  @Override
  @Transactional
  public BlogPost createBlogPost(BlogPost blogPost, User author) {
    blogPost.setAuthor(author);
    return save(blogPost);
  }

  @Override
  @Transactional
  public BlogPost updateBlogPost(UUID id, BlogPostUpdateDTO updateDTO) {
    // UC2/UC5: Find existing blog post
    BlogPost existingBlogPost = blogPostRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("Blog post not found with id: " + id));

    // UC2/UC5: Update fields with validated data
    existingBlogPost.setTitle(updateDTO.getTitle());
    existingBlogPost.setText(updateDTO.getText());
    existingBlogPost.setCategory(updateDTO.getCategory());

    // UC2/UC5: Save and return (updatedAt timestamp will be auto-updated by
    // @PreUpdate)
    return blogPostRepository.save(existingBlogPost);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<BlogPost> findAllWithFilters(Pageable pageable, String category, UUID authorId) {
    // UC4: Support filtering by category and/or author
    boolean hasCategory = category != null && !category.isBlank();
    boolean hasAuthor = authorId != null;

    if (hasCategory && hasAuthor) {
      // Filter by both category and author
      return blogPostRepository.findByCategoryAndAuthorId(category, authorId, pageable);
    } else if (hasCategory) {
      // Filter by category only
      return blogPostRepository.findByCategory(category, pageable);
    } else if (hasAuthor) {
      // Filter by author only
      return blogPostRepository.findByAuthorId(authorId, pageable);
    } else {
      // No filters, return all
      return blogPostRepository.findAll(pageable);
    }
  }

}
