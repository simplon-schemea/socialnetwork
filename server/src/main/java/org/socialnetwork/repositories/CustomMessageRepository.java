package org.socialnetwork.repositories;

import lombok.RequiredArgsConstructor;
import org.socialnetwork.entities.MessageEntity;
import org.socialnetwork.models.MessageType;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.text.MessageFormat;
import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CustomMessageRepository {
    final EntityManager em;

    public List<MessageEntity> findAllByTopic(MessageType type, UUID topic) {
        final String sql = MessageFormat.format("SELECT * FROM {0} JOIN messages m ON message_id = m.id WHERE user_id = ?", type.getTable());
        final var query = em.createNativeQuery(sql, MessageEntity.class);
        query.setParameter(1, topic);

        return query.getResultList();
    }

    public void link(MessageType type, UUID profile, UUID message) {
        final var query = em.createNativeQuery(MessageFormat.format("INSERT INTO {0} VALUES(?, ?)", type.getTable()));

        query.setParameter(1, profile);
        query.setParameter(2, message);

        query.executeUpdate();
    }
}
