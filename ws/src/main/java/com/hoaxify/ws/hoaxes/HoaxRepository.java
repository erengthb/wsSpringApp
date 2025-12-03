package com.hoaxify.ws.hoaxes;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hoaxify.ws.user.User;

public interface HoaxRepository extends JpaRepository<Hoax, Long>{
	
	Page<Hoax> findByStatus(int status, Pageable page);

	Page<Hoax> findByStatusAndIdLessThan(int status, long id, Pageable page);

	Page<Hoax> findByUserAndStatus(User user, int status, Pageable page);

	Page<Hoax> findByUserAndStatusAndIdLessThan(User user, int status, long id, Pageable page);

	long countByStatus(int status);

	Hoax findByIdAndUserUsernameAndStatus(Long id, String username, int status);

}
