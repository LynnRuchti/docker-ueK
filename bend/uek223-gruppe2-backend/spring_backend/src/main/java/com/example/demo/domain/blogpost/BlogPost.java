package com.example.demo.domain.blogpost;

import com.example.demo.core.generic.AbstractEntity;
import com.example.demo.domain.user.User;
import java.time.LocalDateTime;
import java.util.UUID;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Entity
@Table(name = "blog_post")
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
public class BlogPost extends AbstractEntity {

  @NotBlank(message = "Title is required")
  @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters long")
  @Column(name = "title", nullable = false, length = 100)
  private String title;

  @NotBlank(message = "Text is required")
  @Size(min = 20, max = 50000, message = "Text must be between 20 and 50000 characters long")
  @Column(name = "text", nullable = false, columnDefinition = "TEXT")
  private String text;

  @NotBlank(message = "Category is required")
  @Size(max = 100, message = "Category must be at most 100 characters long")
  @Column(name = "category", nullable = false, length = 100)
  private String category;

  @NotNull(message = "Author is required")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_id", nullable = false)
  private User author;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  public BlogPost(UUID id, String title, String text, String category, User author,
      LocalDateTime createdAt, LocalDateTime updatedAt) {
    super(id);
    this.title = title;
    this.text = text;
    this.category = category;
    this.author = author;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }

}
