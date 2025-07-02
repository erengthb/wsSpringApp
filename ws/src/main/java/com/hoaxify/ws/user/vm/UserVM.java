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

    public UserVM(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.followersCount = 0;
        this.followingCount = 0;
    }

    public UserVM(User user, int followersCount, int followingCount) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.followersCount = followersCount;
        this.followingCount = followingCount;
    }

   
}
