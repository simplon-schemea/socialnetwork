package org.socialnetwork.controllers;

import lombok.RequiredArgsConstructor;
import org.socialnetwork.config.Routes;
import org.socialnetwork.resources.ProfileResource;
import org.socialnetwork.services.ProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping(Routes.PROFILES)
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService service;

    @GetMapping("/self")
    public ProfileResource get() {
        return service.getProfileFromSession();
    }

    @GetMapping(Routes.ID)
    public ProfileResource getByID(@PathVariable UUID id) {
        return service.findByUserID(id);
    }
}
