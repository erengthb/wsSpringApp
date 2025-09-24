package com.hoaxify.ws.user;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.shared.GenericResponse;
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
        return userService.getUsers(page, user);
    }

    // 🔴 DEĞİŞEN: multipart/form-data kullanan update endpoint
    @PutMapping(path = "/users/{username}", consumes = "multipart/form-data")
    @PreAuthorize("#username == principal.username")
    public UserVM updateUser(
            @PathVariable String username,
            @RequestPart("displayName") String displayName,
            @RequestPart(value = "phoneNumber", required = false) String phoneNumber,
            @RequestPart(value = "email", required = false) String email,
            @RequestPart(value = "address", required = false) String address,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        User user = userService.updateUserMultipart(username, displayName, phoneNumber, email, address, image);
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
