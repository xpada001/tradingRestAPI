package com.conygre.spring.repo;

import java.util.Collection;

import com.conygre.spring.entities.Trade;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TradingRepository extends MongoRepository<Trade, ObjectId>{
    Collection<Trade> findByStockTicker(String stockTicker);
}
