package com.hoaxify.ws.stock;

import com.hoaxify.ws.file.FileService;
import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.stock.vm.StockVM;
import com.hoaxify.ws.user.User;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/1.0")
public class StockController {

    private final StockService stockService;
    private final FileService fileService;

    public StockController(StockService stockService , FileService fileService) {
        this.stockService = stockService;
        this.fileService = fileService;
    }

    @GetMapping("/users/{username}/stocks")
    public Page<StockVM> getUserStocks(@PathVariable String username, Pageable page) {
        return stockService.getStocks(username, page);
    }

    @PostMapping(value = "/stocks", consumes = "multipart/form-data")
    public StockVM createStock(
            @RequestParam("productName") String productName,
            @RequestParam("description") String description,
            @RequestParam("quantity") Integer quantity,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @CurrentUserAnnotation User loggedInUser) throws IOException {

        // Stok nesnesini oluştur
        Stock stock = new Stock();
        stock.setProductName(productName);
        stock.setDescription(description);
        stock.setQuantity(quantity);

        // DİKKAT: Resmi burada kaydetmiyoruz, sadece Service katmanına geçiyoruz.
        return stockService.saveStock(loggedInUser.getUsername(), stock, image);
    }

    @PatchMapping("/stocks/{stockId}")
    public StockVM updateStockQuantity(@PathVariable Long stockId,
                                       @RequestBody QuantityUpdateModel quantityUpdate,
                                       @CurrentUserAnnotation User loggedInUser) {
        return stockService.updateStockQuantity(
                loggedInUser.getUsername(), stockId, quantityUpdate.getQuantity());
    }

    @DeleteMapping("/stocks/{stockId}")
    public void deleteStock(@PathVariable Long stockId, @CurrentUserAnnotation User loggedInUser) {
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
