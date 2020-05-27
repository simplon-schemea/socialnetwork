package socialnetwork.resources;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

@Getter
@Setter
public class AccountCreationResource {
    @NotEmpty
    @Email
    String mail;

    @NotEmpty
    String password;
}
