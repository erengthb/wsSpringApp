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
    
    // ✅ Yeni eklenen alanlar
    private String email;
    private String phoneNumber;
    private String address;

    public UserVM(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.image = user.getImage();
        this.followersCount = null;
        this.followingCount = null;
        this.isFollowing = false;
        
        // ✅ Contact bilgilerini ekle
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
    }

    public UserVM(User user, boolean isFollowing, int followersCount, int followingCount) {
        this(user);
        this.isFollowing = isFollowing;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
    }
}