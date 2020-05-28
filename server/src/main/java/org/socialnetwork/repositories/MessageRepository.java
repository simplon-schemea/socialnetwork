package org.socialnetwork.repositories;

import org.socialnetwork.entities.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<MessageEntity, UUID> {
}
