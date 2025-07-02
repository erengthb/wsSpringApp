package com.hoaxify.ws.user;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	Page<UserVM> getUsers(Pageable page, @CurrentUserAnnotation User user) {
		return userService.getUsers(page, user).map(UserVM::new);
	}

	@GetMapping("/users/{username}")
    public UserVM getUser(@PathVariable String username) {
        return userService.getUserVMByUsername(username);
    }

    @PostMapping("/users/{username}/follow")
    public UserVM followUser(@PathVariable String username, @AuthenticationPrincipal User loggedInUser) {
        userService.followUser(loggedInUser.getId(), userService.getByUsername(username).getId());
        User followedUser = userService.getByUsername(username);
        int followersCount = userService.getFollowersCount(followedUser.getId());
        int followingCount = userService.getFollowingCount(followedUser.getId());
        return new UserVM(followedUser, followersCount, followingCount);
    }

    @PostMapping("/users/{username}/unfollow")
    public UserVM unfollowUser(@PathVariable String username, @AuthenticationPrincipal User loggedInUser) {
        userService.unfollowUser(loggedInUser.getId(), userService.getByUsername(username).getId());
        User unfollowedUser = userService.getByUsername(username);
        int followersCount = userService.getFollowersCount(unfollowedUser.getId());
        int followingCount = userService.getFollowingCount(unfollowedUser.getId());
        return new UserVM(unfollowedUser, followersCount, followingCount);
    }

    @GetMapping("/users/{username}/followers")
    public Set<UserVM> getFollowers(@PathVariable String username) {
        User user = userService.getByUsername(username);
        Set<User> followers = userService.getFollowers(user.getId());
        return followers.stream()
                .map(u -> {
                    int followersCount = userService.getFollowersCount(u.getId());
                    int followingCount = userService.getFollowingCount(u.getId());
                    return new UserVM(u, followersCount, followingCount);
                })
                .collect(Collectors.toSet());
    }

    @GetMapping("/users/{username}/following")
    public Set<UserVM> getFollowing(@PathVariable String username) {
        User user = userService.getByUsername(username);
        Set<User> following = userService.getFollowing(user.getId());
        return following.stream()
                .map(u -> {
                    int followersCount = userService.getFollowersCount(u.getId());
                    int followingCount = userService.getFollowingCount(u.getId());
                    return new UserVM(u, followersCount, followingCount);
                })
                .collect(Collectors.toSet());
    }

    @GetMapping("/users/{username}/is-following")
    public boolean isFollowing(@PathVariable String username, @AuthenticationPrincipal User loggedInUser) {
        User targetUser = userService.getByUsername(username);
        return userService.isFollowing(loggedInUser.getId(), targetUser.getId());
    }
}