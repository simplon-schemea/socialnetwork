package org.socialnetwork.resources;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter
public class ProfileMessageCreationResource {
    @NotEmpty
    private String content;
}
