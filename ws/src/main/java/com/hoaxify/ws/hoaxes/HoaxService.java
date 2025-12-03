package com.hoaxify.ws.hoaxes;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserService;

@Service
public class HoaxService {
	
	HoaxRepository hoaxRepository;
	
	UserService userService;

	public HoaxService(HoaxRepository hoaxRepository, UserService userService) {
		super();
		this.hoaxRepository = hoaxRepository;
		this.userService = userService;
	}

	public void save(Hoax hoax, User user) {
		hoax.setTimestamp(new Date());
		hoax.setUser(user);
		hoax.setStatus(HoaxStatus.ACTIVE);
		hoaxRepository.save(hoax);
	}

	public Page<Hoax> getHoaxes(Pageable page) {
		return hoaxRepository.findByStatus(HoaxStatus.ACTIVE, page);
	}

	public Page<Hoax> getHoaxesOfUser(String username, Pageable page) {
		User inDB = userService.getByUsername(username);
		return hoaxRepository.findByUserAndStatus(inDB, HoaxStatus.ACTIVE, page);
	}

    public Page<Hoax> getOldHoaxes(long id, Pageable page) {
       return hoaxRepository.findByStatusAndIdLessThan(HoaxStatus.ACTIVE, id,page);
    }

	public Page<Hoax> getOldHoaxesOfUser(String username, long id, Pageable page) {
		User inDB = userService.getByUsername(username);
		return hoaxRepository.findByUserAndStatusAndIdLessThan(inDB, HoaxStatus.ACTIVE, id, page);
	}

	@Transactional
	public Hoax updateHoax(Long id, String content, User user) {
		Hoax inDB = hoaxRepository.findByIdAndUserUsernameAndStatus(id, user.getUsername(), HoaxStatus.ACTIVE);
		if (inDB == null) {
			throw new NotFoundException();
		}
		inDB.setContent(content);
		return inDB;
	}

	@Transactional
	public void softDelete(Long id, User user) {
		Hoax inDB = hoaxRepository.findByIdAndUserUsernameAndStatus(id, user.getUsername(), HoaxStatus.ACTIVE);
		if (inDB == null) {
			throw new NotFoundException();
		}
		inDB.setStatus(HoaxStatus.DELETED);
		hoaxRepository.save(inDB);
	}

}
