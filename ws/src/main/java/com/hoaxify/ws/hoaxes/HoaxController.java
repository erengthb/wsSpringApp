package com.hoaxify.ws.hoaxes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.shared.GenericResponse;

import jakarta.validation.Valid;

@RestController
public class HoaxController {

	@Autowired
	HoaxService hoaxService;

	@PostMapping("/api/1.0/hoaxes")
	public GenericResponse createHoax(@Valid @RequestBody Hoax hoax) {
		hoaxService.save(hoax);
		return new GenericResponse("hoax created");
	}
}
