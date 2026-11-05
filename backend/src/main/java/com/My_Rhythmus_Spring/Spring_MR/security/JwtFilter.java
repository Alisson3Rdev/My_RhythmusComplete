package com.My_Rhythmus_Spring.Spring_MR.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filtro JWT — intercepta TODAS as requisições antes de chegarem nos Controllers.
 * É o "porteiro" da API: verifica se o token JWT está presente e é válido.
 *
 * Extende OncePerRequestFilter para garantir que o filtro rode apenas UMA vez
 * por requisição, mesmo em encadeamentos internos do Spring.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Lógica principal do filtro — executada em toda requisição.
     *
     * Fluxo:
     * 1. Lê o header "Authorization"
     * 2. Extrai o token (remove o prefixo "Bearer ")
     * 3. Valida o token
     * 4. Se válido, registra o usuário como autenticado no contexto do Spring
     * 5. Passa a requisição para o próximo filtro ou Controller
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Lê o header de autorização — ex: "Bearer eyJhbGciOiJIUzI1NiJ9..."
        String authHeader = request.getHeader("Authorization");

        // Só processa se o header existir e começar com "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            // Remove o prefixo "Bearer " para ficar só com o token
            String token = authHeader.substring(7);

            // Valida o token — verifica assinatura e expiração
            if (jwtUtil.validarToken(token)) {
                String email = jwtUtil.extrairEmail(token);

                // Cria um objeto de autenticação com o e-mail do usuário
                // O terceiro parâmetro (List.of()) seria a lista de permissões/roles — vazia por enquanto
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null, List.of());

                // Adiciona detalhes da requisição (IP, etc.) ao objeto de autenticação
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Registra o usuário como autenticado no contexto de segurança do Spring
                // A partir daqui, o Spring sabe que essa requisição é de um usuário logado
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // Passa a requisição para o próximo filtro da cadeia (ou para o Controller)
        // Isso SEMPRE precisa ser chamado, mesmo quando o token é inválido
        filterChain.doFilter(request, response);
    }
}