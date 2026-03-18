package com.talentboard.controller;

import com.talentboard.dto.AuthDto;
import com.talentboard.entity.User;
import com.talentboard.repository.UserRepository;
import com.talentboard.security.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints d'authentification")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    @Operation(summary = "Inscription d'un nouvel utilisateur")
    public ResponseEntity<?> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(User.Role.valueOf(request.getRole().toUpperCase()))
                .build();

        userRepository.save(user);
        String token = jwtUtils.generateToken(user.getEmail());

        return ResponseEntity.ok(new AuthDto.AuthResponse(
                token, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().name()
        ));
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion et obtention du token JWT")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtils.generateToken(user.getEmail());

        return ResponseEntity.ok(new AuthDto.AuthResponse(
                token, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().name()
        ));
    }
}
