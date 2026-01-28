package com.example.demo.domain.blogpost;

import com.example.demo.domain.blogpost.dto.BlogPostCreateDTO;
import com.example.demo.domain.blogpost.dto.BlogPostDTO;
import com.example.demo.domain.blogpost.dto.BlogPostMapper;
import com.example.demo.domain.blogpost.dto.BlogPostPageResponseDTO;
import com.example.demo.domain.blogpost.dto.BlogPostUpdateDTO;
import com.example.demo.domain.user.User;
import com.example.demo.domain.user.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Validated
@RestController
@RequestMapping("/blogpost")
@Tag(name = "Blog Posts", description = "Blog post management APIs")
public class BlogPostController {

  private final BlogPostService blogPostService;
  private final BlogPostMapper blogPostMapper;
  private final com.example.demo.core.security.permissionevaluators.BlogPostPermissionEvaluator blogPostPermissionEvaluator;

  @Autowired
  public BlogPostController(BlogPostService blogPostService, BlogPostMapper blogPostMapper,
      com.example.demo.core.security.permissionevaluators.BlogPostPermissionEvaluator blogPostPermissionEvaluator) {
    this.blogPostService = blogPostService;
    this.blogPostMapper = blogPostMapper;
    this.blogPostPermissionEvaluator = blogPostPermissionEvaluator;
  }

  // UC1: User creates new blog post
  @PostMapping({ "", "/" })
  @PreAuthorize("hasAuthority('BLOGPOST_CREATE')")
  public ResponseEntity<BlogPostDTO> createBlogPost(
      @Valid @RequestBody BlogPostCreateDTO blogPostCreateDTO,
      Authentication authentication) {

    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    User author = userDetails.user();

    BlogPost blogPost = blogPostMapper.fromCreateDTO(blogPostCreateDTO);
    BlogPost createdBlogPost = blogPostService.createBlogPost(blogPost, author);

    return new ResponseEntity<>(blogPostMapper.toDTO(createdBlogPost), HttpStatus.CREATED);
  }

  @Operation
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved blog posts", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BlogPostPageResponseDTO.class)))
  })
  @GetMapping({ "", "/" })
  public ResponseEntity<BlogPostPageResponseDTO> getAllBlogPosts(
      @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Page size (fixed at 5 for UC4)") @RequestParam(defaultValue = "5") int size,
      @Parameter(description = "Sort field: 'date', 'title', or 'category'") @RequestParam(defaultValue = "date") String sortBy,
      @Parameter(description = "Sort order: 'asc' or 'desc'") @RequestParam(defaultValue = "desc") String sortOrder,
      @Parameter(description = "Optional filter by category") @RequestParam(required = false) String category,
      @Parameter(description = "Optional filter by author ID") @RequestParam(required = false) UUID authorId) {

    // UC4: Enforce 5 posts per page
    size = 5;

    // UC4: Create Sort object based on sortBy and sortOrder
    Sort.Direction direction = sortOrder.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
    Sort sort;

    // Map sortBy to actual entity fields
    switch (sortBy.toLowerCase()) {
      case "title":
        sort = Sort.by(direction, "title");
        break;
      case "category":
        sort = Sort.by(direction, "category");
        break;
      case "date":
      default:
        sort = Sort.by(direction, "createdAt");
        break;
    }

    Pageable pageable = PageRequest.of(page, size, sort);

    // UC4: Get paginated and filtered results
    Page<BlogPost> blogPostPage = blogPostService.findAllWithFilters(pageable, category, authorId);

    // Convert to DTOs
    List<BlogPostDTO> blogPostDTOs = blogPostPage.getContent().stream()
        .map(blogPostMapper::toDTO)
        .collect(Collectors.toList());

    // Create paginated response
    BlogPostPageResponseDTO response = new BlogPostPageResponseDTO(
        blogPostDTOs,
        blogPostPage.getTotalPages(),
        blogPostPage.getTotalElements(),
        blogPostPage.getNumber(),
        blogPostPage.getSize(),
        blogPostPage.isFirst(),
        blogPostPage.isLast());

    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved blog post", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BlogPostDTO.class))),
      @ApiResponse(responseCode = "404", description = "Blog post not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<BlogPostDTO> getBlogPostById(
      @Parameter(description = "Blog post ID") @PathVariable UUID id) {
    BlogPost blogPost = blogPostService.findById(id);
    return new ResponseEntity<>(blogPostMapper.toDTO(blogPost), HttpStatus.OK);
  }

  // UC2: User edits own blog post
  @Operation(summary = "Update own blog post", description = "UC2: User updates their own blog post. Validates title (min 5 chars), text (min 20 chars), and category (required).")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Blog post updated successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BlogPostDTO.class))),
      @ApiResponse(responseCode = "400", description = "Validation failed"),
      @ApiResponse(responseCode = "403", description = "User is not the owner"),
      @ApiResponse(responseCode = "404", description = "Blog post not found")
  })
  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('BLOGPOST_EDIT_ANY') or hasAuthority('BLOGPOST_EDIT_OWN')")
  public ResponseEntity<BlogPostDTO> updateBlogPost(
      @PathVariable UUID id,
      @Valid @RequestBody BlogPostUpdateDTO blogPostUpdateDTO,
      Authentication authentication) {

    boolean canEditAny = authentication.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("BLOGPOST_EDIT_ANY"));

    if (!canEditAny && !blogPostPermissionEvaluator.isOwner(id)) {
      throw new AccessDeniedException("Access denied");
    }

    BlogPost updatedBlogPost = blogPostService.updateBlogPost(id, blogPostUpdateDTO);
    return new ResponseEntity<>(blogPostMapper.toDTO(updatedBlogPost), HttpStatus.OK);
  }

  // UC5 Part 1: Admin edits any blog post
  @Operation(summary = "Admin updates any blog post", description = "UC5: Admin updates any blog post. Validates title (min 5 chars), text (min 20 chars), and category (required).")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Blog post updated successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = BlogPostDTO.class))),
      @ApiResponse(responseCode = "400", description = "Validation failed"),
      @ApiResponse(responseCode = "403", description = "User is not admin"),
      @ApiResponse(responseCode = "404", description = "Blog post not found")
  })
  @PutMapping("/admin/{id}")
  @PreAuthorize("hasAuthority('BLOGPOST_MODIFY')")
  public ResponseEntity<BlogPostDTO> adminUpdateBlogPost(
      @Parameter(description = "Blog post ID") @PathVariable UUID id,
      @Valid @RequestBody BlogPostUpdateDTO blogPostUpdateDTO) {

    BlogPost updatedBlogPost = blogPostService.updateBlogPost(id, blogPostUpdateDTO);
    return new ResponseEntity<>(blogPostMapper.toDTO(updatedBlogPost), HttpStatus.OK);
  }

  // UC3: User deletes own blog post
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('BLOGPOST_DELETE_ANY') or hasAuthority('BLOGPOST_DELETE_OWN')")
  public ResponseEntity<Void> deleteBlogPost(@PathVariable UUID id, Authentication authentication) {
    boolean canDeleteAny = authentication.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("BLOGPOST_DELETE_ANY"));

    if (!canDeleteAny && !blogPostPermissionEvaluator.isOwner(id)) {
      throw new AccessDeniedException("Access denied");
    }

    blogPostService.deleteById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  // UC5 Part 2: Admin deletes any blog post
  @Operation(summary = "Admin deletes any blog post", description = "UC5.2: Admin deletes any blog post regardless of ownership.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "Blog post deleted successfully"),
      @ApiResponse(responseCode = "403", description = "User is not admin"),
      @ApiResponse(responseCode = "404", description = "Blog post not found")
  })
  @DeleteMapping("/admin/{id}")
  @PreAuthorize("hasAuthority('BLOGPOST_MODIFY')")
  public ResponseEntity<Void> adminDeleteBlogPost(
      @Parameter(description = "Blog post ID") @PathVariable UUID id) {
    blogPostService.deleteById(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

}
