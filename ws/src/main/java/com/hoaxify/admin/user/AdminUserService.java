package com.hoaxify.admin.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoaxify.admin.AdminAccessDeniedException;
import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.user.User;

@Service
public class AdminUserService {

    private static final String ADMIN_USERNAME = "admin";

    private final AdminUserRepository adminUserRepository;

    public AdminUserService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Transactional(readOnly = true)
    public Page<AdminUserVM> listUsers(String search, Pageable pageable, User currentUser) {
        ensureAdmin(currentUser);
        return adminUserRepository.searchUsers(search, pageable).map(AdminUserVM::new);
    }

    @Transactional
    public AdminUserVM updateUser(String username, AdminUserUpdateRequest request, User currentUser) {
        ensureAdmin(currentUser);
        User target = adminUserRepository.findByUsername(username);
        if (target == null) {
            throw new NotFoundException();
        }
        if (request.getDisplayName() != null) {
            target.setDisplayName(request.getDisplayName());
        }
        if (request.getPhoneNumber() != null) {
            target.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getEmail() != null) {
            target.setEmail(request.getEmail());
        }
        if (request.getAddress() != null) {
            target.setAddress(request.getAddress());
        }
        if (request.getStatus() != null) {
            if (ADMIN_USERNAME.equalsIgnoreCase(target.getUsername()) && request.getStatus() == 0) {
                throw new AdminAccessDeniedException();
            }
            target.setStatus(request.getStatus());
        }
        adminUserRepository.save(target);
        return new AdminUserVM(target);
    }

    private void ensureAdmin(User currentUser) {
        if (currentUser == null || !ADMIN_USERNAME.equalsIgnoreCase(currentUser.getUsername())) {
            throw new AdminAccessDeniedException();
        }
    }
}
