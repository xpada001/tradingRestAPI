package com.conygre.spring.service;

import java.io.IOException;
import java.util.Collection;

import com.conygre.spring.entities.Trade;

import org.bson.types.ObjectId;

public interface TradeService {
    Collection<Trade> getTrades();
    String addTrade(Trade trade) throws StockNotExistException, IOException;
    Boolean deleteAllTrades();
    Collection<Trade> getTradesByTicks(String stockTicker);
    Collection<Trade> deleteTrade(ObjectId id);
    Trade updateStock(ObjectId id, Trade trade);
    // void updateHoldingPrice(String stockTicker, double CurrentPrice);
}