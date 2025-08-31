package com.hoaxify.ws.stock;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
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

    // 1. Kullanıcının stok listesini getir
    @GetMapping("/users/{username}/stocks")
    public Page<Stock> getUserStocks(@PathVariable String username, Pageable page) {
        return stockService.getStocks(username, page);
    }

    // 2. Yeni stok ekle (login olan kullanıcıya ekleniyor)
    @PostMapping("/stocks")
    public Stock createStock(@Valid @RequestBody Stock stock, @CurrentUserAnnotation User loggedInUser) {
        return stockService.saveStock(loggedInUser.getUsername(), stock);
    }

    // 3. Miktarı güncelle (sadece miktar güncelleniyor)
    @PatchMapping("/stocks/{stockId}")
    public Stock updateStockQuantity(
            @PathVariable Long stockId,
            @RequestBody QuantityUpdateModel quantityUpdate,
            @CurrentUserAnnotation User loggedInUser) {
        return stockService.updateStockQuantity(loggedInUser.getUsername(), stockId, quantityUpdate.getQuantity());
    }

      // Silme endpointi
      @DeleteMapping("/stocks/{stockId}")
      public void deleteStock(@PathVariable Long stockId, @CurrentUserAnnotation User loggedInUser) {
          stockService.deleteStock(loggedInUser.getUsername(), stockId);
      }

    @GetMapping("/users/{username}/stocks/search")
    public Page<Stock> searchUserStocks(
    @PathVariable String username,
    @RequestParam(name = "q") String query,
    Pageable pageable) {
         return stockService.searchStocksOfUser(username, query, pageable);
    }   


    

    // DTO modeli
    public static class QuantityUpdateModel {
        private Integer quantity;
        public Integer getQuantity() {
            return quantity;
        }
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

  

}
