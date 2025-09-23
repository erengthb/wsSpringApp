package com.hoaxify.ws.stock;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.stock.vm.StockVM;
import com.hoaxify.ws.user.User;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/1.0")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/users/{username}/stocks")
    public Page<StockVM> getUserStocks(@PathVariable String username, Pageable page) {
        return stockService.getStocks(username, page);
    }

    @PostMapping("/stocks")
    public StockVM createStock(@Valid @RequestBody Stock stock,
                               @CurrentUserAnnotation User loggedInUser) {
        return stockService.saveStock(loggedInUser.getUsername(), stock);
    }

    @PatchMapping("/stocks/{stockId}")
    public StockVM updateStockQuantity(@PathVariable Long stockId,
                                       @RequestBody QuantityUpdateModel quantityUpdate,
                                       @CurrentUserAnnotation User loggedInUser) {
        return stockService.updateStockQuantity(
                loggedInUser.getUsername(), stockId, quantityUpdate.getQuantity());
    }

    @DeleteMapping("/stocks/{stockId}")
    public void deleteStock(@PathVariable Long stockId,
                            @CurrentUserAnnotation User loggedInUser) {
        stockService.deleteStock(loggedInUser.getUsername(), stockId);
    }

    @GetMapping("/users/{username}/stocks/search")
    public Page<StockVM> searchUserStocks(@PathVariable String username,
                                          @RequestParam(name = "q") String query,
                                          Pageable pageable) {
        return stockService.searchStocksOfUser(username, query, pageable);
    }

    public static class QuantityUpdateModel {
        private Integer quantity;
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
