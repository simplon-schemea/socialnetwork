package org.socialnetwork.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.socialnetwork.entities.UserEntity;
import org.socialnetwork.repositories.UserRepository;
import org.socialnetwork.resources.ProfileResource;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserRepository repository;
    private final ModelMapper mapper;

    private final AccountService accountService;
    private final MessageService messageService;

    public ProfileResource findByUserID(UUID id) {
        final UserEntity entity = repository.findById(id).orElseThrow();
        return mapper.map(entity, ProfileResource.class);
    }

    public ProfileResource getProfileFromSession() {
        return findByUserID(accountService.getUserID().orElseThrow());
    }
}
