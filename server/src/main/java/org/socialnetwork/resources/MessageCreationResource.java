package org.socialnetwork.resources;

import lombok.Getter;
import lombok.Setter;
import org.socialnetwork.models.MessageType;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Getter
@Setter
public class MessageCreationResource {
    @NotEmpty
    private String content;

    @NotNull
    MessageType type;

    UUID topic;
}
