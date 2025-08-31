package com.hoaxify.ws.stock;

import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final UserService userService;

    public StockService(StockRepository stockRepository, UserService userService) {
        this.stockRepository = stockRepository;
        this.userService = userService;
    }

    public Page<Stock> getStocks(String username, Pageable page) {
        return stockRepository.findByUserUsername(username, page);
    }

    @Transactional
    public Stock saveStock(String username, Stock stock) {
        User user = userService.getByUsername(username);
        stock.setUser(user);
        return stockRepository.save(stock);
    }

    @Transactional
    public Stock updateStock(String username, Long id, Stock updated) {
        Stock inDB = stockRepository.findByIdAndUserUsername(id, username);
        if (inDB == null) {
            throw new NotFoundException();
        }
        inDB.setProductName(updated.getProductName());
        inDB.setDescription(updated.getDescription());
        inDB.setQuantity(updated.getQuantity());
        inDB.setImage(updated.getImage());
        return stockRepository.save(inDB);
    }

    @Transactional
    public void deleteStock(String username, Long id) {
        Stock inDB = stockRepository.findByIdAndUserUsername(id, username);
        if (inDB == null) {
            throw new NotFoundException();
        }
        stockRepository.delete(inDB);
    }

    @Transactional
    public Stock updateStockQuantity(String username, Long id, Integer newQuantity) {
        Stock inDB = stockRepository.findByIdAndUserUsername(id, username);
        if (inDB == null) {
            throw new NotFoundException();
        }
        inDB.setQuantity(newQuantity);
        return stockRepository.save(inDB);
    }

    public Page<Stock> searchStocksOfUser(String username, String productName, Pageable page) {
        if (productName != null && !productName.trim().isEmpty()) {
            return stockRepository.findByUserUsernameAndProductNameContainingIgnoreCase(username, productName, page);
        }
        return stockRepository.findByUserUsername(username, page);
    }
    

}
