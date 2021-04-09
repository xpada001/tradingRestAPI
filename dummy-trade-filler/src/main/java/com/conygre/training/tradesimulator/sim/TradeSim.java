package com.conygre.training.tradesimulator.sim;

import java.util.List;

import com.conygre.training.tradesimulator.dao.TradeMongoDao;
import com.conygre.training.tradesimulator.model.Trade;
import com.conygre.training.tradesimulator.model.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class TradeSim {
    private static final Logger LOG = LoggerFactory.getLogger(TradeSim.class);

    @Autowired
    private TradeMongoDao tradeDao;

    @Transactional
    public List<Trade> findTradesForProcessing(){
        List<Trade> foundTrades = tradeDao.findBytradeStatus(Status.CREATED);

        for(Trade thisTrade: foundTrades) {
            thisTrade.setTradeStatus(Status.PROCESSING);
            tradeDao.save(thisTrade);
        }

        return foundTrades;
    }

    @Transactional
    public List<Trade> findTradesForFilling(){
        List<Trade> foundTrades = tradeDao.findBytradeStatus(Status.PROCESSING);

        for(Trade thisTrade: foundTrades) {
            if((int) (Math.random()*10) > 8) {
                thisTrade.setTradeStatus(Status.REJECTED);
            }
            else {
                thisTrade.setTradeStatus(Status.FILLED);
            }
            tradeDao.save(thisTrade);
        }

        return foundTrades;
    }

    @Scheduled(fixedRateString = "${scheduleRateMs:10000}")
    public void runSim() {
        LOG.debug("Main loop running!");

        int tradesForFilling = findTradesForFilling().size();
        LOG.debug("Found " + tradesForFilling + " trades to be filled/rejected");

        int tradesForProcessing = findTradesForProcessing().size();
        LOG.debug("Found " + tradesForProcessing + " trades to be processed");

    }
}
