package org.socialnetwork.controllers;

import lombok.RequiredArgsConstructor;
import org.socialnetwork.config.Routes;
import org.socialnetwork.resources.MessageResource;
import org.socialnetwork.resources.ProfileMessageCreationResource;
import org.socialnetwork.services.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.UUID;

@RestController
@RequestMapping(Routes.MESSAGES)
@RequiredArgsConstructor
public class MessageController {
    private final MessageService service;

    @GetMapping(Routes.ID)
    MessageResource get(@PathVariable UUID id) {
        return service.findById(id);
    }

    @PostMapping("/profile-message")
    ResponseEntity<Void> createProfileMessage(@RequestBody @Valid ProfileMessageCreationResource resource) throws URISyntaxException {
        final UUID id = service.createProfileMessage(resource);
        return ResponseEntity.ok().location(new URI(Routes.MESSAGES + "/" + id)).build();
    }
}
