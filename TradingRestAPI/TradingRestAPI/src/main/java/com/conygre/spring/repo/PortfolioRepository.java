package com.conygre.spring.repo;

import com.conygre.spring.entities.Portfolio;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PortfolioRepository extends MongoRepository<Portfolio, ObjectId>{
}
