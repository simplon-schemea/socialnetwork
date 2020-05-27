package org.socialnetwork.resources;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDate;

@Getter
@Setter
public class ProfileResource {
    @NotEmpty
    @Email
    String mail;

    @NotEmpty
    private String firstname;

    @NotEmpty
    private String lastname;

    private LocalDate birthday;
}
