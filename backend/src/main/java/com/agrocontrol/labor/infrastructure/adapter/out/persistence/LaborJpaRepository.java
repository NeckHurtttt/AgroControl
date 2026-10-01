package com.agrocontrol.labor.infrastructure.adapter.out.persistence;

import com.agrocontrol.labor.domain.Labor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LaborJpaRepository extends JpaRepository<Labor, Long> {
    List<Labor> findByCampanaIdOrderByFechaPlanAsc(Long campanaId);
}
