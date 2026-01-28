package com.example.demo.domain.role;

import com.example.demo.domain.role.dto.RoleDTO;
import com.example.demo.domain.role.dto.RoleMapper;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleService roleService;
    private final RoleMapper roleMapper;

    @Autowired
    public RoleController(RoleService roleService, RoleMapper roleMapper) {
        this.roleService = roleService;
        this.roleMapper = roleMapper;
    }

    @GetMapping({ "", "/" })
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<List<RoleDTO>> retrieveAll() {
        List<Role> roles = roleService.findAll();
        return new ResponseEntity<>(roleMapper.toDTOs(roles), HttpStatus.OK);
    }
}
