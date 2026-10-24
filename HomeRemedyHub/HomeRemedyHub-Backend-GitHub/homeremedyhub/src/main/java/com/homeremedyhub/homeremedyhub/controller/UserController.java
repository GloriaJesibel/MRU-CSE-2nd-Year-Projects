package com.homeremedyhub.homeremedyhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.homeremedyhub.homeremedyhub.entity.User;
import com.homeremedyhub.homeremedyhub.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Register User
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // Login User
    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {

        User loggedInUser = userService.loginUser(
                user.getEmail(),
                user.getPassword());

        if (loggedInUser != null) {
            return loggedInUser;
        }

        throw new RuntimeException("Invalid Email or Password");
    }

    // Get User Profile
    @GetMapping("/profile/{email}")
    public User getProfile(@PathVariable String email) {

        User user = userService.getUserByEmail(email);

        if (user != null) {
            return user;
        }

        throw new RuntimeException("User not found");
    }

    // Update User Profile
    @PutMapping("/update")
    public User updateProfile(@RequestBody User user) {

        User updatedUser = userService.updateUser(user);

        if (updatedUser != null) {
            return updatedUser;
        }

        throw new RuntimeException("User not found");
    }

}