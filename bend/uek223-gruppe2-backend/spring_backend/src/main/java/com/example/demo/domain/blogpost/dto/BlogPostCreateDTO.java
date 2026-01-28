package com.example.demo.domain.blogpost.dto;

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
public class BlogPostCreateDTO {

  @NotBlank(message = "Title is required")
  @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters long")
  private String title;

  @NotBlank(message = "Text is required")
  @Size(min = 20, max = 50000, message = "Text must be between 20 and 50000 characters long")
  private String text;

  @NotBlank(message = "Category is required")
  @Size(max = 100, message = "Category must be at most 100 characters long")
  private String category;

  public BlogPostCreateDTO(String title, String text, String category) {
    this.title = title;
    this.text = text;
    this.category = category;
  }

}
