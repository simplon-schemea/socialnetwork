package org.socialnetwork.resources;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponseResource {
    @Builder.Default
    private Map<UUID, AuthorResource> authors = new HashMap<>();

    @Builder.Default
    private Set<MessageResource> messages = new HashSet<>();
}
