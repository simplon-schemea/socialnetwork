package org.socialnetwork.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.socialnetwork.entities.MessageEntity;
import org.socialnetwork.repositories.MessageRepository;
import org.socialnetwork.resources.MessageResource;
import org.socialnetwork.resources.ProfileMessageCreationResource;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository repository;
    private final ModelMapper mapper;
    private final AccountService accountService;

    public MessageResource findById(UUID id) {
        return mapper.map(repository.findById(id), MessageResource.class);
    }

    public UUID createProfileMessage(ProfileMessageCreationResource resource) {
        final MessageEntity entity = mapper.map(resource, MessageEntity.class);

        entity.setAuthor(accountService.getUser().orElseThrow());
        entity.setTimestamp(new Timestamp(System.currentTimeMillis()));
        entity.setProfileMessage(true);

        return repository.save(entity).getId();
    }
}
