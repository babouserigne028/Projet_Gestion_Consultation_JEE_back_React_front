package com.consultation.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.enterprise.context.ApplicationScoped;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;

/**
 * Utilitaire pour la gestion des tokens JWT.
 * Fournit des méthodes pour valider et extraire les informations des tokens.
 */
@ApplicationScoped
public class JWTUtil {

    private static final String SECRET_KEY = "super-secret-key-very-long-and-secure-123";

    private Key getSigningKey() {
        return new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    /**
     * Valide un token JWT et retourne les claims.
     * 
     * @param token Le token JWT à valider
     * @return Les claims du token si valide
     * @throws Exception Si le token est invalide ou expiré
     */
    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Extrait l'email de l'utilisateur d'un token JWT.
     * 
     * @param token Le token JWT
     * @return L'email de l'utilisateur
     */
    public String getEmailFromToken(String token) {
        return validateToken(token).getSubject();
    }

    /**
     * Extrait le rôle de l'utilisateur d'un token JWT.
     * 
     * @param token Le token JWT
     * @return Le rôle de l'utilisateur (ADMIN, MEDECIN, PATIENT)
     */
    public String getRoleFromToken(String token) {
        return validateToken(token).get("role", String.class);
    }

    /**
     * Vérifie si un token est expiré.
     * 
     * @param token Le token JWT
     * @return true si le token est expiré, false sinon
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = validateToken(token);
            return claims.getExpiration().before(new java.util.Date());
        } catch (Exception e) {
            return true;
        }
    }
}
