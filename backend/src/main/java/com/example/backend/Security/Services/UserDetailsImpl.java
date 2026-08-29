package com.example.backend.Security.Services;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.backend.Models.User;
import com.example.backend.Models.Worker;

public class UserDetailsImpl implements UserDetails {

    private String id;
    private String email;
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(
            String id,
            String email,
            String password,
            Collection<? extends GrantedAuthority> authorities) {

        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user) {

        GrantedAuthority authority =
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                List.of(authority));
    }
    public static UserDetailsImpl build(Worker worker) {

    GrantedAuthority authority =
            new SimpleGrantedAuthority(
                    "ROLE_" + worker.getRole().name());

    return new UserDetailsImpl(
            worker.getId(),
            worker.getEmail(),
            worker.getPassword(),
            List.of(authority));
}

    public String getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }
}