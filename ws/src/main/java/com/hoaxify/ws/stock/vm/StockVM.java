package com.hoaxify.ws.stock.vm;

import com.hoaxify.ws.stock.Stock;

public record StockVM(
        Long id,
        String productName,
        String description,
        Integer quantity,
        Double price,
        String imagePath) {
    public StockVM(Stock s) {
        this(s.getId(), s.getProductName(), s.getDescription(),
                s.getQuantity(), s.getPrice(), s.getImage());
    }
}
