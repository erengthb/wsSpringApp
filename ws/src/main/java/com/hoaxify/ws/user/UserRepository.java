package com.hoaxify.ws.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

    Page<User> findByUsernameNot(String username, Pageable page);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END " +
           "FROM User u JOIN u.followers f " +
           "WHERE u.username = :targetUsername AND f.username = :followerUsername")
    boolean isFollowing(@Param("followerUsername") String followerUsername,
                        @Param("targetUsername") String targetUsername);
}
