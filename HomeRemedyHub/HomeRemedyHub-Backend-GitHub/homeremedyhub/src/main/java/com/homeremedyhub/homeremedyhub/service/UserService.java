package com.homeremedyhub.homeremedyhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.homeremedyhub.homeremedyhub.entity.User;
import com.homeremedyhub.homeremedyhub.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register User
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    // Login User
    public User loginUser(String email, String password) {

        User user = userRepository.findByEmail(email);

        if (user != null && user.getPassword().equals(password)) {
            return user;
        }

        return null;
    }

    // Get User Profile
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Update User Profile
    public User updateUser(User updatedUser) {

        User existingUser = userRepository.findByEmail(updatedUser.getEmail());

        if (existingUser == null) {
            return null;
        }

        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setPhone(updatedUser.getPhone());
        existingUser.setLocation(updatedUser.getLocation());
        existingUser.setGender(updatedUser.getGender());
        existingUser.setBloodGroup(updatedUser.getBloodGroup());
        existingUser.setDateOfBirth(updatedUser.getDateOfBirth());
        existingUser.setHeight(updatedUser.getHeight());
        existingUser.setWeight(updatedUser.getWeight());

        return userRepository.save(existingUser);
    }

}