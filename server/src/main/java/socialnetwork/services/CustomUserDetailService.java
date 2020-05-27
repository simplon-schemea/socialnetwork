package socialnetwork.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import socialnetwork.entities.UserEntity;
import socialnetwork.repositories.UserRepository;
import socialnetwork.resources.CustomUserDetails;

import java.text.MessageFormat;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String mail) throws UsernameNotFoundException {
        final UserEntity entity = repository
                .findByMail(mail)
                .orElseThrow(
                        () -> new UsernameNotFoundException(MessageFormat.format("{0} does not exists", mail))
                );

        return new CustomUserDetails(entity);
    }
}
