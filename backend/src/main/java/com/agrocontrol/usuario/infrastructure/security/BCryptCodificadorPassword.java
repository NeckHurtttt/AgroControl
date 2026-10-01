package com.agrocontrol.usuario.infrastructure.security;

import com.agrocontrol.usuario.domain.CodificadorPassword;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BCryptCodificadorPassword implements CodificadorPassword {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public String codificar(String passwordPlano) {
        return encoder.encode(passwordPlano);
    }
}
