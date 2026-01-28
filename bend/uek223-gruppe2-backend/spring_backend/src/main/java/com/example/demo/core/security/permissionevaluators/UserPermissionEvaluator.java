package com.example.demo.core.security.permissionevaluators;

import com.example.demo.domain.user.User;
import com.example.demo.domain.user.UserDetailsImpl;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@NoArgsConstructor
public class UserPermissionEvaluator {

  public boolean isSameUser(UserDetailsImpl principal, UUID id) {
    return principal.user().getId().equals(id);
  }

}
