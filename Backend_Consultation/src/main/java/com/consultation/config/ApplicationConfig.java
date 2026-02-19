package com.consultation.config;

import org.glassfish.jersey.jackson.JacksonFeature;
import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;

@ApplicationPath("/api")
public class ApplicationConfig extends ResourceConfig {
	public ApplicationConfig() {
		super();
		packages("com.consultation.resources", "com.consultation.filters");
		register(JacksonFeature.class);
	}
}
