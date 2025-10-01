package com.hoaxify.ws.stock;

import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.file.FileService;
import com.hoaxify.ws.stock.vm.StockVM;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserService;
import jakarta.transaction.Transactional;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final UserService userService;
    private final FileService fileService;

    public StockService(StockRepository stockRepository, UserService userService ,FileService fileService) {
        this.stockRepository = stockRepository;
        this.userService = userService;
        this.fileService = fileService;
    }

    public Page<StockVM> getStocks(String username, Pageable page) {
        return stockRepository.findByUserUsername(username, page).map(StockVM::new);
    }

    @Transactional
    public StockVM saveStock(String username, Stock stock, MultipartFile stockImage) throws IOException {
    User user = userService.getByUsername(username);
    stock.setUser(user);

    if (stockImage != null && !stockImage.isEmpty()) {
        String imagePath = fileService.saveStockImage(user.getUsername(), stock.getId(), stockImage);
        stock.setImage(imagePath); // Resim yolunu veritabanına kaydet
    }

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

    // Silinecek dosya yolunu önce al
    String imagePath = inDB.getImage();

    // DB'den stoku sil
    stockRepository.delete(inDB);

    // Dosyayı, yalnızca transaksiyon başarıyla commit olursa sil
    if (imagePath != null && !imagePath.isBlank()) {
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                fileService.deleteFile(imagePath);
            }
        });
    }
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
