package org.socialnetwork.resources;

import lombok.Getter;
import lombok.Setter;
import org.socialnetwork.entities.UserEntity;

import java.sql.Timestamp;
import java.util.UUID;

@Getter
@Setter
public class MessageResource {
    private UUID id;
    private UUID author;

    private Timestamp timestamp;
    private String content;

    private boolean isProfileMessage;
}
