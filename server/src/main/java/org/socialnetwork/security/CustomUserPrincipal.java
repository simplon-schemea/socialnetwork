package org.socialnetwork.security;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.socialnetwork.entities.RoleEntity;
import org.socialnetwork.entities.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public class
CustomUserPrincipal implements UserDetails {
    private final UUID userID;
    private final String username, password;
    private final Set<SimpleGrantedAuthority> authorities;

    public CustomUserPrincipal(UserEntity entity) {
        userID = entity.getId();
        username = entity.getMail();
        password = entity.getPassword();
        authorities = entity.getRoles().stream()
                .map(RoleEntity::getName)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public UUID getUserID() {
        return userID;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
