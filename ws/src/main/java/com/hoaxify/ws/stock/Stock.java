package com.hoaxify.ws.stock;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hoaxify.ws.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.Data;

@Data
@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "{stock.productName.NotBlank}")
    @Size(min = 2, max = 100)
    private String productName;

    @Size(max = 500)
    private String description;

    @NotNull(message = "{stock.quantity.NotNull}")
    @Min(value = 0, message = "{stock.quantity.Min}")
    private Integer quantity;


    private String image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
