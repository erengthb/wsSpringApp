package com.hoaxify.ws.stats;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hoaxify.ws.hoaxes.HoaxRepository;
import com.hoaxify.ws.stock.StockRepository;
import com.hoaxify.ws.user.UserRepository;

@Service
public class StatsService {

    private final UserRepository userRepository;
    private final HoaxRepository hoaxRepository;
    private final StockRepository stockRepository;

    public StatsService(UserRepository userRepository, HoaxRepository hoaxRepository, StockRepository stockRepository) {
        this.userRepository = userRepository;
        this.hoaxRepository = hoaxRepository;
        this.stockRepository = stockRepository;
    }

    @Transactional(readOnly = true)
    public StatsVM getOverview() {
        long userCount = userRepository.count();
        long hoaxCount = hoaxRepository.count();
        long stockCount = stockRepository.count();
        return new StatsVM(userCount, hoaxCount, stockCount);
    }
}
