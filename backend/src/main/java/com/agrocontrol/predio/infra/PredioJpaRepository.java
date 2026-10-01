package com.agrocontrol.predio.infra;

import com.agrocontrol.predio.domain.Predio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PredioJpaRepository extends JpaRepository<Predio, Long> {
}
