package com.agrocontrol.auditoria.infrastructure.aop;

import com.agrocontrol.auditoria.application.Auditable;
import com.agrocontrol.auditoria.application.AuditoriaService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.temporal.Temporal;
import java.util.Arrays;
import java.util.Objects;
import java.util.stream.Collectors;

// Adaptador de entrada "transversal": los servicios solo se marcan con @Auditable y no saben de seguridad ni de esta tabla.
@Aspect
@Component
public class AuditoriaAspect {

    private final AuditoriaService auditoriaService;

    public AuditoriaAspect(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @AfterReturning(pointcut = "@annotation(auditable)", returning = "resultado")
    public void registrar(JoinPoint punto, Auditable auditable, Object resultado) {
        Long idEntidad = idDe(resultado);
        if (idEntidad == null) {
            idEntidad = Arrays.stream(punto.getArgs()).filter(Long.class::isInstance).map(Long.class::cast)
                    .findFirst().orElse(null);
        }
        if (idEntidad == null) {
            return;
        }
        auditoriaService.registrar(usuarioActual(), auditable.entidad(), idEntidad, auditable.accion(),
                detalle(punto.getArgs(), idEntidad));
    }

    private static Long idDe(Object resultado) {
        if (resultado == null) {
            return null;
        }
        try {
            Method getId = resultado.getClass().getMethod("getId");
            return getId.invoke(resultado) instanceof Long id ? id : null;
        } catch (ReflectiveOperationException e) {
            return null;
        }
    }

    // Solo valores simples (textos, números, fechas, enums): nunca objetos que puedan traer contraseñas
    // El id auditado ya está en su columna: no se repite en el detalle.
    private static String detalle(Object[] args, Long idEntidad) {
        String texto = Arrays.stream(args)
                .filter(Objects::nonNull)
                .filter(a -> !idEntidad.equals(a))
                .filter(a -> a instanceof CharSequence || a instanceof Number || a instanceof Boolean
                        || a instanceof Enum<?> || a instanceof Temporal)
                .map(String::valueOf)
                .collect(Collectors.joining(" · "));
        return texto.length() > 500 ? texto.substring(0, 500) : texto;
    }

    private static Long usuarioActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            return Long.valueOf(jwt.getSubject());
        }
        return null;
    }
}
