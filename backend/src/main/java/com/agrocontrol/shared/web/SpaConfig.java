package com.agrocontrol.shared.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Sirve el frontend empaquetado en classpath:/static (perfil Maven fullstack). Las rutas de
 * React Router (/predios, /parcelas/3...) no existen como archivo: se responde index.html y el
 * router del navegador resuelve la página.
 */
@Configuration
public class SpaConfig implements WebMvcConfigurer {

    private static final Resource INDEX = new ClassPathResource("static/index.html");

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource recurso = location.createRelative(resourcePath);
                        if (recurso.exists() && recurso.isReadable()) {
                            return recurso;
                        }
                        // Un archivo que falta (/assets/x.js) o una ruta de la API es un 404 real, no una página.
                        if (resourcePath.startsWith("api/") || resourcePath.contains(".") || !INDEX.exists()) {
                            return null;
                        }
                        return INDEX;
                    }
                });
    }
}
