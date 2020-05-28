package org.socialnetwork.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.socialnetwork.entities.MessageEntity;
import org.socialnetwork.models.MessageType;
import org.socialnetwork.repositories.CustomMessageRepository;
import org.socialnetwork.repositories.MessageRepository;
import org.socialnetwork.resources.MessageCreationResource;
import org.socialnetwork.resources.MessageResource;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository repository;
    private final CustomMessageRepository customRepository;

    private final ModelMapper mapper;

    private final AccountService accountService;

    public MessageResource findById(UUID id) {
        return mapper.map(repository.findById(id), MessageResource.class);
    }

    public Set<MessageResource> findAllByTopic(MessageType type, UUID topic) {
        return customRepository.findAllByTopic(type, topic)
                .stream()
                .map(message -> {
                    final MessageResource resource = mapper.map(message, MessageResource.class);
                    resource.setAuthor(message.getId());

                    return resource;
                })
                .collect(Collectors.toSet());
    }

    @Transactional
    public UUID createMessage(MessageCreationResource resource) {
        final String table = resource.getType().getTable();

        if (Objects.isNull(resource.getTopic()) && resource.getType() == MessageType.PROFILE) {
            resource.setTopic(accountService.getUserID().orElseThrow());
        }

        if (Objects.isNull(resource.getTopic())) {
            throw new IllegalArgumentException("bord is required");
        }

        MessageEntity entity = mapper.map(resource, MessageEntity.class);

        entity.setAuthor(accountService.getUser().orElseThrow());
        entity.setTimestamp(new Timestamp(System.currentTimeMillis()));

        entity = repository.save(entity);
        customRepository.link(table, resource.getTopic(), entity.getId());

        return entity.getId();
    }
}
