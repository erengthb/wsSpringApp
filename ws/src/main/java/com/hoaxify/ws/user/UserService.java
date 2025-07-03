package com.hoaxify.ws.user;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.file.FileService;
import com.hoaxify.ws.user.vm.UserUpdateVM;
import com.hoaxify.ws.utils.DateUtil;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final FileService fileService;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, FileService fileService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.fileService = fileService;
	}

	public void save(User user) {
		user.setPassword(this.passwordEncoder.encode(user.getPassword()));
		user.setCreateDate(DateUtil.getCurrentDateString());
		userRepository.save(user);
	}

	public Page<User> getUsers(Pageable page, User user) {
		if (user != null) {
			return userRepository.findByUsernameNot(user.getUsername(), page);
		}
		return userRepository.findAll(page);
	}

	@Transactional
	public User getByUsername(String username) {
    User user = userRepository.findByUsername(username);
    if (user == null) {
        throw new NotFoundException();
    }
    user.getFollowers().size();  // Lazy yüklemeyi tetikle
    user.getFollowing().size();
    return user;
}


	public User updateUser(String username, UserUpdateVM updatedUser) {
		User inDB = getByUsername(username);
		inDB.setDisplayName(updatedUser.getDisplayName());
		if (updatedUser.getImage() != null) {
			String oldImageName = inDB.getImage();
			try {
				String storedFileName = fileService.writeBase64EncodedStringToFile(updatedUser.getImage());
				inDB.setImage(storedFileName);
			} catch (IOException e) {
				e.printStackTrace();
			}
			fileService.deleteFile(oldImageName);
		}
		return userRepository.save(inDB);
	}

	@Transactional
public void follow(String followerUsername, String toFollowUsername) {
    if (followerUsername.equals(toFollowUsername)) {
        throw new IllegalArgumentException("You cannot follow yourself.");
    }

    User follower = getByUsername(followerUsername); // full user with followers/following loaded
    User toFollow = getByUsername(toFollowUsername);

    if (!follower.getFollowing().contains(toFollow)) {
        follower.getFollowing().add(toFollow);
        userRepository.save(follower);
    }
}

@Transactional
public void unfollow(String followerUsername, String toUnfollowUsername) {
    User follower = getByUsername(followerUsername);
    User toUnfollow = getByUsername(toUnfollowUsername);

    if (follower.getFollowing().contains(toUnfollow)) {
        follower.getFollowing().remove(toUnfollow);
        userRepository.save(follower);
    }
}


	public boolean isFollowing(String followerUsername, String targetUsername) {
		return userRepository.isFollowing(followerUsername, targetUsername);
	}

}
