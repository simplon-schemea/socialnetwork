package org.socialnetwork.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.socialnetwork.security.CustomUserPrincipal;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TokenService {
    Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String USERNAME = "username";
    public static String AUTHORITIES = "authorities";

    public String generate(CustomUserPrincipal principal) {
        final Set<String> authorities = principal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        final Date expiration = new Date(System.currentTimeMillis() + 1000 * 3600);

        return Jwts.builder()
                .setSubject(principal.getUserID().toString())
                .claim(USERNAME, principal.getUsername())
                .claim(AUTHORITIES, authorities)
                .setExpiration(expiration)
                .signWith(key)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
}
