package org.socialnetwork.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.socialnetwork.entities.UserEntity;
import org.socialnetwork.repositories.UserRepository;
import org.socialnetwork.resources.CustomUserDetails;
import org.socialnetwork.resources.ProfileResource;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserRepository repository;
    private final ModelMapper mapper;

    public ProfileResource getProfileFromSession() {
        final SecurityContext sc = SecurityContextHolder.getContext();

        final Object principal = sc.getAuthentication().getPrincipal();

        if (principal instanceof CustomUserDetails) {
            final UserEntity entity = ((CustomUserDetails) principal).getUser();

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
}
