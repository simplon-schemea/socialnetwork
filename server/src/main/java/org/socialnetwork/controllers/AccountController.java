package org.socialnetwork.controllers;

import lombok.RequiredArgsConstructor;
import org.socialnetwork.config.Routes;
import org.socialnetwork.resources.AccountCreationResource;
import org.socialnetwork.resources.AccountLoginResource;
import org.socialnetwork.resources.ProfileResource;
import org.socialnetwork.services.AccountService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(Routes.ACCOUNT)
@RequiredArgsConstructor
public class AccountController {
    private final AccountService service;

    @PostMapping("/register")
    ProfileResource register(@RequestBody @Valid AccountCreationResource input) {
        return service.register(input);
    }

    @PostMapping("/login")
    ProfileResource login(@RequestBody @Valid AccountLoginResource input) {
        return service.login(input);
    }
 }
