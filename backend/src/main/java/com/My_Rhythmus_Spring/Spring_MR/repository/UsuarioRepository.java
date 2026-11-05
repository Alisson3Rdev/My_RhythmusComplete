package com.My_Rhythmus_Spring.Spring_MR.repository;

import com.My_Rhythmus_Spring.Spring_MR.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório responsável por toda comunicação com o banco de dados.
 *
 * Ao extender JpaRepository<Usuario, Long>, ganhamos de graça os métodos:
 *   - save(usuario)         → INSERT ou UPDATE
 *   - findById(id)          → SELECT por ID
 *   - findAll()             → SELECT todos
 *   - deleteById(id)        → DELETE por ID
 *   - existsById(id)        → verifica se existe por ID
 *
 * O Spring gera o SQL automaticamente baseado no nome dos métodos abaixo.
 */
@Repository // Marca essa interface como um componente de acesso a dados do Spring
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * O Spring lê "findByEmailUser" e gera automaticamente:
     * SELECT * FROM tbuser WHERE email_user = ?
     *
     * Retorna Optional<Usuario> porque o usuário pode não existir —
     * o Optional evita NullPointerException.
     */
    Optional<Usuario> findByEmailUser(String emailUser);

    /**
     * Gera: SELECT COUNT(*) > 0 FROM tbuser WHERE email_user = ?
     * Usado no cadastro para checar se o e-mail já está em uso
     * antes de tentar salvar, evitando erro de constraint unique do banco.
     */
    boolean existsByEmailUser(String emailUser);
}