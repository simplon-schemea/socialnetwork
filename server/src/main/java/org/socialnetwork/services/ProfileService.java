package org.socialnetwork.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.socialnetwork.entities.UserEntity;
import org.socialnetwork.repositories.MessageRepository;
import org.socialnetwork.repositories.UserRepository;
import org.socialnetwork.resources.MessageResource;
import org.socialnetwork.resources.ProfileResource;
import org.socialnetwork.security.CustomUserPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserRepository repository;
    private final ModelMapper mapper;

    private final MessageRepository messageRepository;

    public ProfileResource getProfileFromSession() {
        final SecurityContext sc = SecurityContextHolder.getContext();

        final Object principal = sc.getAuthentication().getPrincipal();

        if (principal instanceof CustomUserPrincipal) {
            final UserEntity entity = ((CustomUserPrincipal) principal).getUser();

            if (entity == null) {
                throw new IllegalArgumentException("not logged in");
            }

            return mapper.map(entity, ProfileResource.class);
        }

        return null;
    }

    public ProfileResource findByUserID(UUID id) {
        final UserEntity entity = repository.findById(id).orElseThrow();
        return mapper.map(entity, ProfileResource.class);
    }

    public Set<MessageResource> getProfileMessages(UUID id) {
        return messageRepository.findProfileMessages(id).stream()
                .map(message -> {
                    final MessageResource resource = mapper.map(message, MessageResource.class);
                    resource.setAuthor(message.getId());

                    return resource;
                })
                .collect(Collectors.toSet());
    }
}
