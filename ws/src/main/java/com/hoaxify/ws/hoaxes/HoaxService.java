package com.hoaxify.ws.hoaxes;

import org.springframework.beans.factory.annotation.Autowired;
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
    	hoax.setHoaxUser(hoax.getHoaxUser());
    	hoax.setCreateDate(DateUtil.getCurrentDateString());
        return hoaxRepository.save(hoax);
    }
}
