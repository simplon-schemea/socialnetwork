package org.socialnetwork.resources;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class ProfileResource {
    private UUID id;
    private String mail;
    private String firstname;
    private String lastname;
    private LocalDate birthday;
}
