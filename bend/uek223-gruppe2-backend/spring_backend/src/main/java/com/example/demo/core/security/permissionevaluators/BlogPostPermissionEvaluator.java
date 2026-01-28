package com.example.demo.core.security.permissionevaluators;

import com.example.demo.domain.blogpost.BlogPost;
import com.example.demo.domain.blogpost.BlogPostService;
import com.example.demo.domain.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class BlogPostPermissionEvaluator {

  private final BlogPostService blogPostService;

  @Autowired
  public BlogPostPermissionEvaluator(BlogPostService blogPostService) {
    this.blogPostService = blogPostService;
  }

  public boolean isOwner(UUID blogPostId) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      return false;
    }

    Object principal = authentication.getPrincipal();
    if (!(principal instanceof com.example.demo.domain.user.UserDetailsImpl)) {
      return false;
    }

    User currentUser = ((com.example.demo.domain.user.UserDetailsImpl) principal).user();
    BlogPost blogPost = blogPostService.findById(blogPostId);

    return blogPost != null && blogPost.getAuthor() != null
        && blogPost.getAuthor().getId().equals(currentUser.getId());
  }

}
