package com.hoaxify.ws.user.vm;

import com.hoaxify.ws.user.User;
import lombok.Data;

@Data
public class UserVM {

    private Long id;
    private String username;
    private String displayName;
    private String image;
    private Integer followersCount;
    private Integer followingCount;
    private boolean isFollowing;

    public UserVM(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.image = user.getImage();
        this.followersCount = null; // Default olarak null
        this.followingCount = null;
        this.isFollowing = false;
    }

    public UserVM(User user, boolean isFollowing, int followersCount, int followingCount) {
        this(user);
        this.isFollowing = isFollowing;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
    }
}
