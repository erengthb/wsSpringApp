package com.hoaxify.admin.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hoaxify.ws.user.User;

public interface AdminUserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    @Query("""
        SELECT u FROM User u
        WHERE (:search IS NULL OR :search = '' OR
              lower(u.username) LIKE lower(concat('%', :search, '%')) OR
              lower(u.displayName) LIKE lower(concat('%', :search, '%')) OR
              lower(u.email) LIKE lower(concat('%', :search, '%')))
        """)
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);
}
