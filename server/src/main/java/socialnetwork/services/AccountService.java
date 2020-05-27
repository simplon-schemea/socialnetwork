package socialnetwork.services;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import socialnetwork.entities.RoleEntity;
import socialnetwork.entities.UserEntity;
import socialnetwork.repositories.RoleRepository;
import socialnetwork.repositories.UserRepository;
import socialnetwork.resources.AccountCreationResource;
import socialnetwork.resources.AccountLoginResource;
import socialnetwork.resources.CustomUserDetails;

import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

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

    @Transactional
    public void register(AccountCreationResource input) {
        final UserEntity entity = mapper.map(input, UserEntity.class);
        final RoleEntity defaultRole = roleRepository.findByName("ROLE_USER").orElseThrow();

        entity.setPassword(encoder.encode(input.getPassword()));
        entity.getRoles().add(defaultRole);

        repository.save(entity);
    }

    public void login(AccountLoginResource input) {
        {
            final SecurityContext sc = SecurityContextHolder.getContext();

            if (sc != null) {
                final Object principal = sc.getAuthentication().getPrincipal();

                if (principal instanceof CustomUserDetails) {

                    CustomUserDetails user = (CustomUserDetails) principal;

                    if (user.isEnabled() && user.isCredentialsNonExpired()) {
                        throw new IllegalArgumentException("already logged in");
                    }
                }
            }
        }

        var token = new UsernamePasswordAuthenticationToken(input.getMail(), input.getPassword());

        final Authentication authentication = authenticationManager.authenticate(token);

        final SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(authentication);

        getSession().setAttribute(SPRING_SECURITY_CONTEXT_KEY, sc);
    }
}
