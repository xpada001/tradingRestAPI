package com.conygre.spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TradingRestApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(TradingRestApiApplication.class, args);
	}
}
