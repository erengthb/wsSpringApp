package com.hoaxify.admin.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.user.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/1.0")
@Validated
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping("/users")
    public Page<AdminUserVM> listUsers(
            @RequestParam(value = "search", required = false) String search,
            @PageableDefault(sort = "createDate", direction = Direction.DESC) Pageable pageable,
            @CurrentUserAnnotation User currentUser) {
        return adminUserService.listUsers(search, pageable, currentUser);
    }

    @PutMapping("/users/{username}")
    public AdminUserVM updateUser(
            @PathVariable String username,
            @Valid @RequestBody AdminUserUpdateRequest request,
            @CurrentUserAnnotation User currentUser) {
        return adminUserService.updateUser(username, request, currentUser);
    }
}
