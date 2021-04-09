package com.conygre.spring;

import com.conygre.spring.controller.TradeController;
import com.conygre.spring.entities.Status;
import com.conygre.spring.entities.Type;
import com.conygre.spring.entities.Trade;
import com.conygre.spring.service.StockNotExistException;

import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.context.annotation.PropertySource;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

import java.io.IOException;
import java.util.Date;

@PropertySource("./resources/test.properties")
@SpringBootTest
class TradingRestApiApplicationTests {

	public static final String TEST_ID = "5f46a3d545bee629d17fd7b2";

	@Autowired
	private TradeController controller;

	@Test
	void contextLoads() {

	}

	@AfterEach
	void tearDown() {
		// controller.getTrades().clear();
		controller.deleteAllTrades();

	}

	@Test
	void testAdd() throws StockNotExistException, IOException {
		Trade add1 = new Trade(new Date(20141020),"APPL", 100, 2000, Status.CREATED, Type.BUY);
		controller.addTrade(add1);
		assertThat(controller.getTrades().size(), is(1));
	}


	@Test
	void testDelete() throws StockNotExistException, IOException {
		Trade delete = new Trade(new Date(20141020),"APPL", 100, 2000, Status.CREATED, Type.BUY);
		delete.setTradeStatus(Status.CREATED);
		controller.addTrade(delete);
		controller.deleteTrade(delete.getId());
		assertThat(controller.getTrades().size(), is(0));
	}


	@Test
	void testId(){
		Trade testId = new Trade();
		testId.setId(new ObjectId(TEST_ID));
		assertThat(testId.getId().toString(), is(TEST_ID));
	}

	@Test
	void testDate() {
		Trade testTrade = new Trade();
		testTrade.setDateCreated(new Date(20141020));
		assertThat(testTrade.getDateCreated(), is(new Date(20141020)));
	}

	@Test
	void testQuantity(){
		Trade testTrade = new Trade();
		testTrade.setStockQuantity(100);
		assertThat(testTrade.getStockQuantity(), is(100));
	}


	@Test
	void testRequestedPrice (){
		Trade testTrade = new Trade();
		testTrade.setRequestedPrice(5);
		assertThat(testTrade.getRequestedPrice(), is((double)5));
	}

	@Test
	void testTicker(){
		Trade testTrade = new Trade();
		testTrade.setStockTicker("NAS");
		assertThat(testTrade.getStockTicker(), is("NAS"));
	}

	@Test
	void testStatus(){
		Trade testTrade = new Trade();
		testTrade.setTradeStatus(Status.CREATED);
		assertThat(testTrade.getTradeStatus(), is(Status.CREATED));
	}


}
