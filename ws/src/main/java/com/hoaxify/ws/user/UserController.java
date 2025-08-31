package com.hoaxify.ws.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.user.vm.UserUpdateVM;
import com.hoaxify.ws.user.vm.UserVM;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/1.0")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/users")
    public GenericResponse createUser(@Valid @RequestBody User user) {
        userService.save(user);
        return new GenericResponse("user created");
    }

    @GetMapping("/users")
    public Page<UserVM> getUsers(Pageable page, @CurrentUserAnnotation User user) {
        return userService.getUsers(page, user).map(UserVM::new);
    }

	@PutMapping("/users/{username}")
    @PreAuthorize("#username == principal.username")
    public UserVM updateUser(@Valid @RequestBody UserUpdateVM updatedUser, @PathVariable String username) {
        User user = userService.updateUser(username, updatedUser);
        return new UserVM(user);
    }



    @GetMapping("/users/{username}")
    public UserVM getUser(@PathVariable String username, @CurrentUserAnnotation User loggedInUser) {
        User targetUser = userService.getByUsername(username);
        boolean isFollowing = false;
        if (loggedInUser != null && !loggedInUser.getUsername().equals(username)) {
            isFollowing = userService.isFollowing(loggedInUser.getUsername(), username);
        }
        int followersCount = targetUser.getFollowers().size();
        int followingCount = targetUser.getFollowing().size();
        return new UserVM(targetUser, isFollowing, followersCount, followingCount);
    }

    @PostMapping("/users/{username}/follow")
    public ResponseEntity<?> follow(@PathVariable String username, @AuthenticationPrincipal User loggedInUser) {
        userService.follow(loggedInUser.getUsername(), username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{username}/unfollow")
    public ResponseEntity<?> unfollow(@PathVariable String username, @AuthenticationPrincipal User loggedInUser) {
        userService.unfollow(loggedInUser.getUsername(), username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/{username}/followers")
    public List<UserVM> getFollowers(@PathVariable String username, Pageable page) {
        return userService.getFollowers(username, page);
    }
    
    @GetMapping("/users/{username}/following")
    public List<UserVM> getFollowing(@PathVariable String username, Pageable page) {
        return userService.getFollowing(username, page);
    }

}
