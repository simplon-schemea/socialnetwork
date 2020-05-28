package org.socialnetwork.models;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MessageType {
    PROFILE("profile_message"),
    REPLY("replies");

    private final String table;
}
