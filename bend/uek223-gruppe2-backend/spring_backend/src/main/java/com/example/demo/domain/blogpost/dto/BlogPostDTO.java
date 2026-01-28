package com.example.demo.domain.blogpost.dto;

import com.example.demo.core.generic.AbstractDTO;
import com.example.demo.domain.user.dto.UserDTO;
import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
public class BlogPostDTO extends AbstractDTO {

  @NotBlank(message = "Title is required")
  @Size(min = 5, message = "Title must be at least 5 characters long")
  private String title;

  @NotBlank(message = "Text is required")
  @Size(min = 20, message = "Text must be at least 20 characters long")
  private String text;

  @NotBlank(message = "Category is required")
  private String category;

  @Valid
  private UserDTO author;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  public BlogPostDTO(UUID id, String title, String text, String category, 
                     UserDTO author, LocalDateTime createdAt, LocalDateTime updatedAt) {
    super(id);
    this.title = title;
    this.text = text;
    this.category = category;
    this.author = author;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

}
