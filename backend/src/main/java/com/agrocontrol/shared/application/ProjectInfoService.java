package com.agrocontrol.shared.application;

import org.springframework.stereotype.Service;

@Service
public class ProjectInfoService {

    public String projectName() {
        return "AgroControl";
    }

    public String backendStage() {
        return "SPRING_BOOT_BASE";
    }
}
