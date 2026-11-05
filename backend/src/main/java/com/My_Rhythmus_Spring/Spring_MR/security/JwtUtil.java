package com.My_Rhythmus_Spring.Spring_MR.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Na versão 0.12.x do jjwt a API foi reformulada:
 * - SignatureAlgorithm foi removido dos parâmetros do signWith()
 * - parserBuilder() virou parser()
 * - parseClaimsJws() virou parseSignedClaims()
 * - Keys.hmacShaKeyFor() agora retorna SecretKey em vez de Key
 */
@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    // 1 hora em milissegundos
    private static final long EXPIRATION_MS = 3600000;

    // 7 dias em milissegundos
    private static final long REFRESH_EXPIRATION_MS = 604800000;

    // Claim usada para distinguir access token de refresh token
    private static final String CLAIM_TIPO = "tipo";
    private static final String TIPO_ACCESS  = "access";
    private static final String TIPO_REFRESH = "refresh";

    // Gera a chave criptográfica a partir da string secreta
    private SecretKey key;

    @PostConstruct
    void initializeSigningKey() {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT_SECRET deve conter pelo menos 32 bytes.");
        }
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Gera um access token JWT com claim "tipo=access".
     * Duração: 1 hora.
     */
    public String gerarToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim(CLAIM_TIPO, TIPO_ACCESS)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    /**
     * Gera um refresh token JWT com claim "tipo=refresh".
     * Duração: 7 dias.
     * A claim "tipo" impede que este token seja aceito como access token e vice-versa.
     */
    public String gerarRefreshToken(String email) {
        return Jwts.builder()
                .subject(email)
                .claim(CLAIM_TIPO, TIPO_REFRESH)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    /**
     * Extrai o e-mail (subject) de dentro do token.
     */
    public String extrairEmail(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Valida um access token: assinatura correta, não expirado e tipo == "access".
     */
    public boolean validarToken(String token) {
        try {
            Claims claims = getClaims(token);
            return TIPO_ACCESS.equals(claims.get(CLAIM_TIPO, String.class));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Valida um refresh token: assinatura correta, não expirado e tipo == "refresh".
     * Impede que um accessToken seja usado no endpoint /refresh.
     */
    public boolean validarRefreshToken(String token) {
        try {
            Claims claims = getClaims(token);
            return TIPO_REFRESH.equals(claims.get(CLAIM_TIPO, String.class));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Método auxiliar que faz o parse do token e retorna os Claims (payload).
     */
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}