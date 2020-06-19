package org.socialnetwork.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.socialnetwork.security.CustomUserPrincipal;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TokenService {
    PrivateKey privateKey;
    PublicKey publicKey;

    public static String USERNAME = "username";
    public static String AUTHORITIES = "authorities";

    byte[] parsePrivateKey(byte[] bytes) {
        final String data = new String(bytes).replaceAll("\\r?\\n", "");

        final String begin = "-----BEGIN PRIVATE KEY-----";
        final String end = "-----END PRIVATE KEY-----";

        String key;

        if (data.startsWith(begin) && data.endsWith(end)) {
            key = data.substring(begin.length(), data.length() - end.length());
        } else {
            key = data;
        }

        return Base64.getDecoder().decode(key);
    }

    @PostConstruct
    void loadPrivateKey() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        final Path path = Paths.get(System.getenv("SN_PRIVATE_KEY"));
        final byte[] bytes = parsePrivateKey(Files.readAllBytes(path));

        final PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(bytes);
        final KeyFactory keyFactory = KeyFactory.getInstance("RSA");

        privateKey = keyFactory.generatePrivate(privateKeySpec);
    }

    @PostConstruct
    void loadPublicKey() throws CertificateException, FileNotFoundException {
        final FileInputStream stream = new FileInputStream(System.getenv("SN_CERTIFICATE"));

        final CertificateFactory certificateFactory = CertificateFactory.getInstance("X509");
        final Certificate certificate = certificateFactory.generateCertificate(stream);

        publicKey = certificate.getPublicKey();
    }

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
                .signWith(privateKey)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .setAllowedClockSkewSeconds(60)
                .build()
                .parseClaimsJws(token);
    }
}
