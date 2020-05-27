package socialnetwork.entities;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity(name = "users")
@Getter
@Setter
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Email
    @NotEmpty
    private String mail;

    @NotEmpty
    private String password;

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "user_role",
            inverseJoinColumns = @JoinColumn(name = "role_id"),
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Fetch(FetchMode.JOIN)
    private Set<RoleEntity> roles = new HashSet<>();
}
