package com.infosys.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.infosys.auth_service.dto.LoginRequest;
import com.infosys.auth_service.dto.LoginResponse;
import com.infosys.auth_service.dto.RegisterRequest;
import com.infosys.auth_service.service.AuthService;

@RestController
@RequestMapping("/auth")

public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(service.login(request));
    }
}
