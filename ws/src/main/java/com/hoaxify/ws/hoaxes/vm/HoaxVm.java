package com.hoaxify.ws.hoaxes.vm;

import java.util.Date;

import com.hoaxify.ws.hoaxes.Hoax;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.vm.UserVM;

import lombok.Data;

@Data
public class HoaxVm {
    
  
	private long id;
	

	private String content;
	
	
	private long timestamp;

	private UserVM user;

    public HoaxVm(Hoax hoax){
        this.setId(hoax.getId());
        this.setContent(hoax.getContent());
        this.setTimestamp(hoax.getTimestamp().getTime());
        this.setUser(new UserVM( hoax.getUser()));
    }


}
