package com.My_Rhythmus_Spring.Spring_MR.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
    public static String getEmailUsuarioLogado() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }
}