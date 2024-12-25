package com.hoaxify.ws.hoaxes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hoaxify.ws.utils.DateUtil;

@Service
public class HoaxService {

	private final HoaxRepository hoaxRepository;

	@Autowired
	public HoaxService(HoaxRepository hoaxRepository) {
		this.hoaxRepository = hoaxRepository;
	}

	public Hoax save(Hoax hoax) {
		hoax.setCreateDate(DateUtil.getCurrentDateString());
		hoax.setCreateTime(DateUtil.getCurrentTimeWithMillis());
		return hoaxRepository.save(hoax);
	}

	public Page<Hoax> getHoaxes(Pageable page) {
		return hoaxRepository.findAll(page);

	}

}
