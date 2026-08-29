package com.example.backend.Security.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.backend.Models.User;
import com.example.backend.Repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
private UserRepository userRepository;

// @Autowired
// private WorkerRepository workerRepository;

@Override
public UserDetails loadUserByUsername(String email)
        throws UsernameNotFoundException {

    User user = userRepository.findByEmail(email);

    if (user != null) {
        return UserDetailsImpl.build(user);
    }

    // Worker worker = workerRepository.findByEmail(email);

    // if (worker != null) {
    //     return UserDetailsImpl.build(worker);
    // }

    throw new UsernameNotFoundException(
            "User Not Found with email: " + email);
}
}