package com.My_Rhythmus_Spring.Spring_MR.controller;

import com.My_Rhythmus_Spring.Spring_MR.model.Usuario;
import com.My_Rhythmus_Spring.Spring_MR.dto.LoginRequestDTO;
import com.My_Rhythmus_Spring.Spring_MR.dto.RefreshRequestDTO;
import com.My_Rhythmus_Spring.Spring_MR.repository.UsuarioRepository;
import com.My_Rhythmus_Spring.Spring_MR.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.annotation.PostConstruct;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controller responsável pela autenticação.
 * Rota pública — qualquer um pode chamar para obter um token JWT.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    private String hashSentinela;

    @PostConstruct
    void initializeSentinelHash() {
        hashSentinela = passwordEncoder.encode(java.util.UUID.randomUUID().toString());
    }

    /**
     * POST /api/auth/login
     * Recebe email e senha, valida e retorna access token + refresh token.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO body) {
        String email = body.getEmail();
        String senha = body.getSenha();

        // Hash sentinela: passwordEncoder.matches() é sempre executado,
        // evitando timing attack mesmo quando o usuário não existe.
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmailUser(email);

        String hashParaComparar = usuarioOpt
                .map(Usuario::getSenhaUser)
                .orElse(hashSentinela);

        boolean senhaCorreta = passwordEncoder.matches(senha, hashParaComparar);

        // Mesma resposta para "usuário não existe" e "senha errada" — não vaza informação.
        if (usuarioOpt.isEmpty() || !senhaCorreta) {
            return ResponseEntity.status(401).body(Map.of("erro", "Credenciais inválidas.", "status", 401));
        }

        String accessToken  = jwtUtil.gerarToken(email);
        String refreshToken = jwtUtil.gerarRefreshToken(email);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return ResponseEntity.ok(tokens);
    }

    /**
     * POST /api/auth/refresh
     * Recebe o refresh token e retorna um novo access token.
     * Usa validarRefreshToken() — rejeita accessToken passado no lugar do refreshToken.
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshRequestDTO body) {
        String refreshToken = body.getRefreshToken();

        if (!jwtUtil.validarRefreshToken(refreshToken)) {
            return ResponseEntity.status(401).body(Map.of("erro", "Refresh token inválido ou expirado.", "status", 401));
        }

        String email = jwtUtil.extrairEmail(refreshToken);
        String novoAccessToken = jwtUtil.gerarToken(email);

        Map<String, String> response = new HashMap<>();
        response.put("accessToken", novoAccessToken);

        return ResponseEntity.ok(response);
    }
}