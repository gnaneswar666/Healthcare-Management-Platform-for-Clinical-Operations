package com.infosys.auth_service.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.auth_service.Model.User;



public interface UserRepository extends MongoRepository<User,String>{

    Optional<User> findByUsername(String username);

}
