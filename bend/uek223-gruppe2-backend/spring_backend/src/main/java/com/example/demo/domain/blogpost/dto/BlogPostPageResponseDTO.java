package com.example.demo.domain.blogpost.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * DTO for paginated blog post responses (UC4)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostPageResponseDTO {

    private List<BlogPostDTO> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;
    private int pageSize;
    private boolean first;
    private boolean last;

}
