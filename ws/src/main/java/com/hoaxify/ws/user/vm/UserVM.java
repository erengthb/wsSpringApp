package com.hoaxify.ws.user.vm;

import com.hoaxify.ws.user.User;
import lombok.Data;

@Data
public class UserVM {

    private Long id;
    private String username;
    private String displayName;
    private int followersCount;
    private int followingCount;
    private boolean isFollowing;

    public UserVM(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.followersCount = user.getFollowers() != null ? user.getFollowers().size() : 0;
        this.followingCount = user.getFollowing() != null ? user.getFollowing().size() : 0;
        this.isFollowing = false; // default
    }

    public UserVM(User user, boolean isFollowing) {
        this(user);
        this.isFollowing = isFollowing;
    }
}
