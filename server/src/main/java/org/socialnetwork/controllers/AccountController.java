package org.socialnetwork.controllers;

import lombok.RequiredArgsConstructor;
import org.socialnetwork.config.Routes;
import org.socialnetwork.resources.AccountCreationResource;
import org.socialnetwork.resources.AccountLoginResource;
import org.socialnetwork.services.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping(Routes.ACCOUNT)
@RequiredArgsConstructor
public class AccountController {
    private final AccountService service;

    @PostMapping("/register")
    ResponseEntity<Void> register(@RequestBody @Valid AccountCreationResource input) throws URISyntaxException {
        return ResponseEntity.ok()
                .location(new URI(Routes.PROFILES + "/" + service.register(input)))
                .build();
    }

    @PostMapping("/login")
    ResponseEntity<String> login(@RequestBody @Valid AccountLoginResource input) throws URISyntaxException {
        return ResponseEntity.ok(service.login(input));
    }

    @GetMapping("/logout")
    void logout() {
        service.logout();
    }
 }
