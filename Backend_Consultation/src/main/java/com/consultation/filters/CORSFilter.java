package com.consultation.filters;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
@PreMatching
public class CORSFilter implements ContainerRequestFilter, ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Intercepter les requêtes OPTIONS (preflight) et retourner immédiatement
        if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
            requestContext.abortWith(
                    Response.ok()
                            .header("Access-Control-Allow-Origin", "http://localhost:5173")
                            .header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization")
                            .header("Access-Control-Allow-Credentials", "true")
                            .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
                            .header("Access-Control-Max-Age", "86400")
                            .build());
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
            throws IOException {
        // Éviter les doublons - vérifier si le header CORS existe déjà
        if (responseContext.getHeaders().get("Access-Control-Allow-Origin") == null) {
            responseContext.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");
            responseContext.getHeaders().add("Access-Control-Allow-Headers",
                    "origin, content-type, accept, authorization");
            responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");
            responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
        }
    }
}
