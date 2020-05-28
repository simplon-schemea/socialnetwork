package org.socialnetwork.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.socialnetwork.entities.RoleEntity;
import org.socialnetwork.entities.UserEntity;
import org.socialnetwork.repositories.RoleRepository;
import org.socialnetwork.repositories.UserRepository;
import org.socialnetwork.resources.AccountCreationResource;
import org.socialnetwork.resources.AccountLoginResource;
import org.socialnetwork.resources.CustomUserDetails;
import org.socialnetwork.resources.ProfileResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final ModelMapper mapper;
    private final AuthenticationManager authenticationManager;

    private final RoleRepository roleRepository;

    HttpSession getSession() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();

        return attr.getRequest().getSession(true);
    }

    Optional<CustomUserDetails> getUserDetails() {
        final Object details = SecurityContextHolder.getContext().getAuthentication().getDetails();

        if (details instanceof CustomUserDetails) {
            return Optional.of((CustomUserDetails) details);
        } else {
            return Optional.empty();
        }
    }

    Optional<UserEntity> getUser() {
        return getUserDetails().map(CustomUserDetails::getUser);
    }

    Optional<UUID> getUserID() {
        return getUser().map(UserEntity::getId);
    }

    @Transactional
    public ProfileResource register(AccountCreationResource input) {
        final UserEntity entity = mapper.map(input, UserEntity.class);
        final RoleEntity defaultRole = roleRepository.findByName("ROLE_USER").orElseThrow();

        entity.setPassword(encoder.encode(input.getPassword()));
        entity.getRoles().add(defaultRole);

        return mapper.map(repository.save(entity), ProfileResource.class);
    }

    public ProfileResource login(AccountLoginResource input) {
        {
            CustomUserDetails user = getUserDetails().orElse(null);

            if (user != null && user.isEnabled() && user.isCredentialsNonExpired()) {
                throw new IllegalArgumentException("already logged in");
            }
        }

        var token = new UsernamePasswordAuthenticationToken(input.getMail(), input.getPassword());

        final Authentication authentication = authenticationManager.authenticate(token);

        final SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(authentication);

        getSession().setAttribute(SPRING_SECURITY_CONTEXT_KEY, sc);

        return mapper.map(authentication.getPrincipal(), ProfileResource.class);
    }

    public void logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }
}
