package socialnetwork.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import socialnetwork.resources.AccountCreationResource;
import socialnetwork.resources.AccountLoginResource;
import socialnetwork.services.AccountService;

import javax.validation.Valid;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {
    final private AccountService service;

    @PostMapping("/register")
    void register(@RequestBody @Valid AccountCreationResource input) {
        service.register(input);
    }

    @PostMapping("/login")
    String login(@RequestBody @Valid AccountLoginResource input) {
        service.login(input);

        return "success";
    }
}
