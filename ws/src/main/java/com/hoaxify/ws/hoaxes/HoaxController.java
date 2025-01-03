package com.hoaxify.ws.hoaxes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.shared.GenericResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/1.0")
public class HoaxController {

	@Autowired
	HoaxService hoaxService;

	@PostMapping("/hoaxes")
	public GenericResponse createHoax(@Valid @RequestBody Hoax hoax) {
		hoaxService.save(hoax);
		return new GenericResponse("hoax created");
	}

	@GetMapping("/hoaxes")
	public Page<Hoax> getHoaxes(Pageable page) {
		return hoaxService.getHoaxes(page);
	}
}
