package org.socialnetwork.controllers;

import lombok.RequiredArgsConstructor;
import org.socialnetwork.config.Routes;
import org.socialnetwork.models.MessageType;
import org.socialnetwork.resources.MessageResource;
import org.socialnetwork.resources.MessageCreationResource;
import org.socialnetwork.resources.MessageResponseResource;
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

    @GetMapping("/list")
    MessageResponseResource list(@RequestParam MessageType type, @RequestParam UUID topic) {
        return service.findAllByTopic(type, topic);
    }

    @PostMapping
    ResponseEntity<Void> createMessage(@RequestBody @Valid MessageCreationResource resource) throws URISyntaxException {
        final UUID id = service.createMessage(resource);
        return ResponseEntity.ok().location(new URI(Routes.MESSAGES + "/" + id)).build();
    }
}
