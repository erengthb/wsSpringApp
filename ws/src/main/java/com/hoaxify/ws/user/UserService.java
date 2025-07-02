package com.hoaxify.ws.user;

import java.io.IOException;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.file.FileService;
import com.hoaxify.ws.user.vm.UserUpdateVM;
import com.hoaxify.ws.user.vm.UserVM;
import com.hoaxify.ws.utils.DateUtil;



@Service
public class UserService {

	UserRepository userRepository;

	PasswordEncoder passwordEncoder;

	FileService fileService;

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

	public User getByUsername(String username) {
		User inDB = userRepository.findByUsername(username);
		if (inDB == null) {
			throw new NotFoundException();
		}
		return inDB;
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

	public UserVM getUserVMByUsername(String username) {
        User user = getByUsername(username);
        int followersCount = userRepository.getFollowersCount(user.getId());
        int followingCount = userRepository.getFollowingCount(user.getId());
        return new UserVM(user, followersCount, followingCount);
    }

    @Transactional
    public void followUser(Long followerId, Long followedId) {
        if (followerId.equals(followedId)) {
            throw new IllegalArgumentException("User cannot follow themselves");
        }
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));

        if (!follower.getFollowing().contains(followed)) {
            follower.getFollowing().add(followed);
            userRepository.save(follower);
        }
    }

    @Transactional
    public void unfollowUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));

        if (follower.getFollowing().contains(followed)) {
            follower.getFollowing().remove(followed);
            userRepository.save(follower);
        }
    }

    public boolean isFollowing(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new RuntimeException("Followed user not found"));
        return follower.getFollowing().contains(followed);
    }

    public Set<User> getFollowers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowers();
    }

    public Set<User> getFollowing(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFollowing();
    }

	public int getFollowersCount(Long userId) {
        return userRepository.getFollowersCount(userId);
    }

    public int getFollowingCount(Long userId) {
        return userRepository.getFollowingCount(userId);
    }

}