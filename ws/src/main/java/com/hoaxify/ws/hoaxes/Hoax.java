package com.hoaxify.ws.hoaxes;

import java.util.Date;

import com.hoaxify.ws.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "hoax")
public class Hoax {
	
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Size(min=1, max=1000)
	@Column(length = 1000)
	private String content;
	
	@Temporal(TemporalType.TIMESTAMP)
	private Date timestamp;

	@Column(nullable = false, columnDefinition = "integer default 1")
	private int status = HoaxStatus.ACTIVE;

	@ManyToOne
    @JoinColumn(name = "user_id") 
	private User user;

	@PrePersist
	void prePersist() {
		if (status == 0) {
			status = HoaxStatus.ACTIVE;
		}
	}

}
