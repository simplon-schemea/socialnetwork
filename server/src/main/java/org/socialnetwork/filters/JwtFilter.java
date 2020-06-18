package org.socialnetwork.filters;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import lombok.RequiredArgsConstructor;
import org.socialnetwork.security.CustomUserPrincipal;
import org.socialnetwork.services.TokenService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final TokenService service;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        final String authorization = request.getHeader("Authorization");

        if (Objects.nonNull(authorization) && authorization.startsWith("Bearer ")) {
            final String jwt = authorization.substring(7);

            final Jws<Claims> claims = service.parse(jwt);
            final Claims body = claims.getBody();

            final UUID userID = UUID.fromString(body.getSubject());
            final String username = body.get(TokenService.USERNAME, String.class);
            final ArrayList<?> roles = body.get(TokenService.AUTHORITIES, ArrayList.class);

            final Set<SimpleGrantedAuthority> authorities = roles.stream()
                    .map(String.class::cast)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toSet());

            final CustomUserPrincipal principal = new CustomUserPrincipal(userID, username, null, authorities);
            final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(principal, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(token);
        }

        chain.doFilter(request, response);
    }
}
