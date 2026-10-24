package com.homeremedyhub.homeremedyhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homeremedyhub.homeremedyhub.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

}