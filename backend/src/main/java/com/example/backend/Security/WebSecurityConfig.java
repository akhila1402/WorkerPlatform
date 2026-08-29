package com.example.backend.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

import com.example.backend.Security.Jwt.AuthEntryPointJwt;
import com.example.backend.Security.Jwt.AuthTokenFilter;
import com.example.backend.Security.Services.UserDetailsServiceImpl;

@EnableMethodSecurity
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthEntryPointJwt unauthorizedHandler;
  


  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

@Bean
public DaoAuthenticationProvider authenticationProvider() {

    DaoAuthenticationProvider authProvider =
            new DaoAuthenticationProvider(userDetailsService);

    authProvider.setPasswordEncoder(passwordEncoder());

    return authProvider;
}

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }


  @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())

        .exceptionHandling(exception ->
            exception.authenticationEntryPoint(unauthorizedHandler)
        )

        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )

        .headers(headers -> headers

            // Prevent XSS by restricting resource loading
            .contentSecurityPolicy(csp -> csp.policyDirectives(
                "default-src 'self'; " +
                "script-src 'self'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "object-src 'none'; " +
                "frame-ancestors 'none';"
            ))
            // Prevent MIME type sniffing
            .contentTypeOptions(Customizer.withDefaults())
            // Prevent Clickjacking
            .frameOptions(frame -> frame.deny())
            // Control referrer information
            .referrerPolicy(referrer ->
                referrer.policy(
                    ReferrerPolicyHeaderWriter.ReferrerPolicy
                        .STRICT_ORIGIN_WHEN_CROSS_ORIGIN
                )
            )
        )

        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/**").permitAll()
            .requestMatchers("/test/**").permitAll()
            .requestMatchers("/ai/**").hasAnyRole("USER", "WORKER", "ADMIN")
            .anyRequest().authenticated()
        );

    http.authenticationProvider(authenticationProvider());

    http.addFilterBefore(
        authenticationJwtTokenFilter(),
        UsernamePasswordAuthenticationFilter.class
    );

    return http.build();
}

  @Bean
  public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
      org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
      configuration.setAllowedOrigins(java.util.Arrays.asList("http://localhost:5173", "http://localhost:3000", "http://localhost:5174")); 
      configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      configuration.setAllowedHeaders(java.util.Arrays.asList("*"));
      configuration.setAllowCredentials(true);
      
      org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);
      return source;
  }
}
