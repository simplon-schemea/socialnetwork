package org.socialnetwork.services;

import lombok.RequiredArgsConstructor;
import org.socialnetwork.entities.UserEntity;
import org.socialnetwork.repositories.UserRepository;
import org.socialnetwork.resources.CustomUserDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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
