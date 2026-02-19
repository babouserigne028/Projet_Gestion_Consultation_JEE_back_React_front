package com.consultation.filters;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;

/**
 * Filtre JWT pour sécuriser les endpoints REST.
 * Vérifie la présence et la validité du token JWT dans le header Authorization.
 * 
 * Endpoints publics (non protégés) :
 * - POST /auth/login
 * - POST /auth/register
 * - OPTIONS (requêtes CORS preflight)
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class JWTAuthFilter implements ContainerRequestFilter {

    // Clé secrète pour valider les tokens (doit être identique à celle dans
    // AuthService)
    private static final String SECRET_KEY = "super-secret-key-very-long-and-secure-123";

    private Key getSigningKey() {
        return new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();
        String method = requestContext.getMethod();

        // Endpoints publics - pas de vérification JWT
        if (isPublicEndpoint(path, method)) {
            return;
        }

        // Récupérer le header Authorization
        String authHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            abortWithUnauthorized(requestContext, "Token manquant ou format invalide");
            return;
        }

        // Extraire le token (enlever "Bearer ")
        String token = authHeader.substring(7);

        try {
            // Valider et parser le token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Ajouter les informations de l'utilisateur au contexte de la requête
            String email = claims.getSubject();
            String role = claims.get("role", String.class);

            requestContext.setProperty("userEmail", email);
            requestContext.setProperty("userRole", role);

        } catch (ExpiredJwtException e) {
            abortWithUnauthorized(requestContext, "Token expiré");
        } catch (MalformedJwtException e) {
            abortWithUnauthorized(requestContext, "Token malformé");
        } catch (SignatureException e) {
            abortWithUnauthorized(requestContext, "Signature du token invalide");
        } catch (Exception e) {
            abortWithUnauthorized(requestContext, "Token invalide: " + e.getMessage());
        }
    }

    /**
     * Vérifie si l'endpoint est public (ne nécessite pas d'authentification)
     */
    private boolean isPublicEndpoint(String path, String method) {
        // OPTIONS pour les requêtes CORS preflight
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }

        // Endpoints d'authentification
        if (path.startsWith("auth/login") || path.startsWith("auth/register")) {
            return true;
        }

        // Endpoints publics pour consultation des services et médecins
        if (path.startsWith("services") && "GET".equalsIgnoreCase(method)) {
            return true;
        }

        return false;
    }

    /**
     * Interrompt la requête avec une réponse 401 Unauthorized
     */
    private void abortWithUnauthorized(ContainerRequestContext requestContext, String message) {
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .entity("{\"error\": \"" + message + "\", \"code\": \"UNAUTHORIZED\"}")
                        .header("Content-Type", "application/json")
                        .build());
    }
}
