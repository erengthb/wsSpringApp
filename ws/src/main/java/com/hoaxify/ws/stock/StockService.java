package com.hoaxify.ws.stock;

import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.stock.vm.StockVM;
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

    public Page<StockVM> getStocks(String username, Pageable page) {
        return stockRepository.findByUserUsername(username, page).map(StockVM::new);
    }

    @Transactional
    public StockVM saveStock(String username, Stock stock) {
        User user = userService.getByUsername(username);
        stock.setUser(user);
        return new StockVM(stockRepository.save(stock));
    }

    @Transactional
    public StockVM updateStock(String username, Long id, Stock updated) {
        Stock inDB = stockRepository.findByIdAndUserUsername(id, username);
        if (inDB == null) {
            throw new NotFoundException();
        }
        inDB.setProductName(updated.getProductName());
        inDB.setDescription(updated.getDescription());
        inDB.setQuantity(updated.getQuantity());
        inDB.setImage(updated.getImage());
        return new StockVM(stockRepository.save(inDB));
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
    public StockVM updateStockQuantity(String username, Long id, Integer newQuantity) {
        Stock inDB = stockRepository.findByIdAndUserUsername(id, username);
        if (inDB == null) {
            throw new NotFoundException();
        }
        inDB.setQuantity(newQuantity);
        return new StockVM(stockRepository.save(inDB));
    }

    public Page<StockVM> searchStocksOfUser(String username, String productName, Pageable page) {
        if (productName != null && !productName.trim().isEmpty()) {
            return stockRepository
                    .findByUserUsernameAndProductNameContainingIgnoreCase(username, productName, page)
                    .map(StockVM::new);
        }
        return stockRepository.findByUserUsername(username, page).map(StockVM::new);
    }
}
