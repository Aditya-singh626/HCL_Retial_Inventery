package com.aditya.retail_inventery.service;

import com.aditya.retail_inventery.entity.User;
import com.aditya.retail_inventery.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> getAllUsers() { return repo.findAll(); }
    public User getUser(Long id) { return repo.findById(id).orElse(null); }
    public User saveUser(User user) { return repo.save(user); }
    public void deleteUser(Long id) { repo.deleteById(id); }
    public User updateUser(Long id, User user) {
        User existingUser = repo.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            return repo.save(existingUser);
        }
        return null;
    }   
}
