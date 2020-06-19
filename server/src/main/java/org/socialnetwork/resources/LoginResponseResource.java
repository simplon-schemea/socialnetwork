package org.socialnetwork.resources;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponseResource {
    private final String accessToken;
    private final String refreshToken;
}
