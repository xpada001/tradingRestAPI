package com.conygre.spring.controller;

import java.util.Date;
import java.util.List;

import java.util.logging.Logger;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;

import com.conygre.spring.entities.Status;
import com.conygre.spring.entities.Type;
import com.conygre.spring.entities.Trade;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;


import org.springframework.web.client.RestTemplate;

@PropertySource("./resources/test.properties")
public class TradeControllerFunctionalTesting {

    private static RestTemplate template = new RestTemplate();
    public static final String testId = "5f4d53d385bc4c32d648c392";
    public static final String testId2 = "5f4d56d185bc4c32d648c39d";
    public static final int newStatus = 4;
    public static final String testName = "GOOGL";
    Trade trade1 = new Trade(new Date(), "GOOGL", 10, 50.0, Status.CREATED, Type.BUY);
    Trade trade2 = new Trade(new Date(), "NHL", 12, 20.4, Status.CREATED, Type.BUY);
    Trade trade3 = new Trade(new Date(), "not-exist", 32, 20.4, Status.CREATED, Type.SELL);

    private static Logger log = Logger.getLogger(Trade.class.getName());

    @BeforeAll
    public static void startup() {
        template.delete("http://localhost:8080/trades");
    }

    @BeforeEach
    public void setup() {
        template.postForObject("http://localhost:8080/trades", trade1, String.class);
    }

    @Test
    public void testInsertion() {
        template.postForObject("http://localhost:8080/trades", trade2, String.class);

        @SuppressWarnings("unchecked") // specifying raw List.class        
        List<Trade> newTrades = template.getForObject("http://localhost:8080/trades", List.class);

        log.info(newTrades.toString());
        log.info("testing insert stock-test-2");
        assertThat(newTrades, hasSize(2));
    }

    @Test
    public void testInsertNotExistStock() {
        try {
            template.postForObject("http://localhost:8080/trades", trade3, String.class);

        } catch (HttpClientErrorException e) {
            assertThat(e.getStatusCode().value(), is(404));
        }

        @SuppressWarnings("unchecked") // specifying raw List.class
        List<Trade> newTrades = template.getForObject("http://localhost:8080/trades", List.class);

        log.info(newTrades.toString());
        log.info("testing insert not-exist");
        assertThat(newTrades, hasSize(1));
    }

    @Test
    public void testFindAll() {
        log.info("testing find all");
        @SuppressWarnings("unchecked") // specifying raw List.class
        List<Trade> trades = template.getForObject("http://localhost:8080/trades", List.class);
        
        assertThat(trades, hasSize(1));
    }

    @Test
    public void testFindTradesByTickerName() {
        log.info("testing find trades by Ticker name");

        // add some more trades
        Trade trade3 = new Trade(new Date(), "GOOGL", 100, 530.0, Status.CREATED, Type.BUY);
        Trade trade4 = new Trade(new Date(), "NHL", 125, 204.4, Status.CREATED, Type.SELL);
        template.postForObject("http://localhost:8080/trades", trade3, String.class);
        template.postForObject("http://localhost:8080/trades", trade4, String.class);

        @SuppressWarnings("unchecked") // specifying raw List.class
        List<Trade> trades = template.getForObject("http://localhost:8080/trades/" + testName, List.class);

        assertThat(trades, hasSize(2));
    }

    @Test
    public void testDeleteOne() {

        ResponseEntity<String> res = template.postForEntity("http://localhost:8080/trades", trade2, String.class);
        String addedId = res.getBody();

        log.info("testing delete one");
        template.delete("http://localhost:8080/trades/" + addedId);

        @SuppressWarnings("unchecked") // specifying raw List.class
        List<Trade> newTrade = template.getForObject("http://localhost:8080/trades", List.class);

        assertThat(newTrade, hasSize(1));
    }

    @Test
    public void testDeleteAll() {
        template.delete("http://localhost:8080/trades");

        @SuppressWarnings("unchecked") // specifying raw List.class
        List<Trade> trades = template.getForObject("http://localhost:8080/trades", List.class);
        
        assertThat(trades, hasSize(0));
    }

    @AfterEach
    public void cleanup() {
        log.info("clean up");

        template.delete("http://localhost:8080/trades");
    }
}