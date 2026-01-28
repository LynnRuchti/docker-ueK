package com.example.demo.domain.blogpost.dto;

import com.example.demo.core.generic.AbstractMapper;
import com.example.demo.domain.blogpost.BlogPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BlogPostMapper extends AbstractMapper<BlogPost, BlogPostDTO> {
  
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "author", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  BlogPost fromDTO(BlogPostDTO dto);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "author", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  BlogPost fromCreateDTO(BlogPostCreateDTO dto);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "author", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  BlogPost fromUpdateDTO(BlogPostUpdateDTO dto);
}
