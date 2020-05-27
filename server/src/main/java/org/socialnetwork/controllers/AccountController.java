package org.socialnetwork.controllers;

import lombok.RequiredArgsConstructor;
import org.socialnetwork.resources.AccountCreationResource;
import org.socialnetwork.resources.AccountLoginResource;
import org.socialnetwork.resources.ProfileResource;
import org.socialnetwork.services.AccountService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {
    final private AccountService service;

    @PostMapping("/register")
    ProfileResource register(@RequestBody @Valid AccountCreationResource input) {
        return service.register(input);
    }

    @PostMapping("/login")
    ProfileResource login(@RequestBody @Valid AccountLoginResource input) {
        return service.login(input);
    }

    @GetMapping("/profile")
    ProfileResource getProfile() {
        return service.getProfile();
    }
 }
