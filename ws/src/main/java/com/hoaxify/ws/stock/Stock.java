package com.hoaxify.ws.stock;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hoaxify.ws.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @NotNull(message = "{stock.price.NotNull}")
    @DecimalMin(value = "0.0", inclusive = true, message = "{stock.price.Min}")
    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
