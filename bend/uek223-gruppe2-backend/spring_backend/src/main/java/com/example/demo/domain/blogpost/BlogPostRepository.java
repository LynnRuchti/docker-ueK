package com.example.demo.domain.blogpost;

import com.example.demo.core.generic.AbstractRepository;
import com.example.demo.domain.user.User;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogPostRepository extends AbstractRepository<BlogPost> {

  Page<BlogPost> findAll(Pageable pageable);

  Page<BlogPost> findByCategory(String category, Pageable pageable);

  Page<BlogPost> findByAuthor(User author, Pageable pageable);

  Page<BlogPost> findByAuthorId(UUID authorId, Pageable pageable);

  Page<BlogPost> findByCategoryAndAuthorId(String category, UUID authorId, Pageable pageable);

}
