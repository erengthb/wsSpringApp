package com.hoaxify.ws.hoaxes;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.hoaxes.vm.HoaxVm;
import com.hoaxify.ws.hoaxes.vm.HoaxUpdateRequest;
import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.user.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/1.0")
public class HoaxController {
	
	@Autowired
	HoaxService hoaxService;
	
	@PostMapping("/hoaxes")
	GenericResponse saveHoax(@Valid @RequestBody Hoax hoax, @CurrentUserAnnotation User user) {
		hoaxService.save(hoax, user);
		return new GenericResponse("Hoax is saved");
	}

	@Transactional
	@PutMapping("/hoaxes/{id:[0-9]+}")
	HoaxVm updateHoax(@PathVariable Long id, @Valid @RequestBody HoaxUpdateRequest request,
			@CurrentUserAnnotation User user) {
		Hoax updated = hoaxService.updateHoax(id, request.getContent(), user);
		return new HoaxVm(updated);
	}

	@Transactional
	@DeleteMapping("/hoaxes/{id:[0-9]+}")
	GenericResponse deleteHoax(@PathVariable Long id, @CurrentUserAnnotation User user) {
		hoaxService.softDelete(id, user);
		return new GenericResponse("Hoax is deleted");
	}

	@Transactional(readOnly = true)
	@GetMapping("/hoaxes")
	Page<HoaxVm> getHoaxes(@PageableDefault(sort = "id", direction = Direction.DESC) Pageable page){
		return hoaxService.getHoaxes(page).map(HoaxVm::new);
	}

	@Transactional(readOnly = true)
	@GetMapping("/hoaxes/{id:[0-9]+}")
	Page<HoaxVm> getHoaxesRelative(@PageableDefault(sort = "id", direction = Direction.DESC) Pageable page ,@PathVariable long id){
		return hoaxService.getOldHoaxes(id,page).map(HoaxVm::new);
	}
	@Transactional(readOnly = true)
	@GetMapping("/users/{username}/hoaxes") 
	Page<HoaxVm> getUserHoaxes(@PathVariable String username, @PageableDefault(sort = "id", direction = Direction.DESC) Pageable page){
		return hoaxService.getHoaxesOfUser(username, page).map(HoaxVm::new);
	}

	@Transactional(readOnly = true)
	@GetMapping("/users/{username}/hoaxes/{id:[0-9]+}")
	Page<HoaxVm> getOldHoaxesOfUser(@PathVariable String username, @PathVariable long id, @PageableDefault(sort = "id", direction = Direction.DESC) Pageable page) {
		return hoaxService.getOldHoaxesOfUser(username, id, page).map(HoaxVm::new);
	}

}
