package com.hoaxify.ws.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long>{

	User findByUsername(String username);
	
	Page<User> findByUsernameNot(String username, Pageable page);

	@Query("select size(u.followers) from User u where u.id = :userId")
    int getFollowersCount(@Param("userId") Long userId);

    @Query("select size(u.following) from User u where u.id = :userId")
    int getFollowingCount(@Param("userId") Long userId);
	
}