package com.conygre.training.tradesimulator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TradeSimulatorApplication {

	public static void main(String[] args) {
		SpringApplication.run(TradeSimulatorApplication.class, args);
	}

}


