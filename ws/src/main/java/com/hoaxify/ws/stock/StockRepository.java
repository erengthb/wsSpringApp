package com.hoaxify.ws.stock;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {

    Page<Stock> findByUserUsername(String username, Pageable pageable);

    Stock findByIdAndUserUsername(Long id, String username);

    Page<Stock> findByUserUsernameAndProductNameContainingIgnoreCase(String username, String productName, Pageable pageable);

}
