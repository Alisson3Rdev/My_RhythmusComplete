package com.My_Rhythmus_Spring.Spring_MR.controller;

import com.My_Rhythmus_Spring.Spring_MR.dto.UsuarioDTO;
import com.My_Rhythmus_Spring.Spring_MR.dto.UsuarioRequestDTO;
import com.My_Rhythmus_Spring.Spring_MR.dto.PerfilUpdateDTO;
import com.My_Rhythmus_Spring.Spring_MR.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /*
     * POST /api/usuarios/cadastrar
     * Cria um novo usuário. Rota pública (sem necessidade de token).
     */
    @PostMapping("/cadastrar")
    public ResponseEntity<UsuarioDTO> cadastrar(@Valid @RequestBody UsuarioRequestDTO dto) {
        return ResponseEntity.status(201).body(usuarioService.cadastrar(dto));
    }

    /*
     * GET /api/usuarios
     * Lista todos os usuários. Rota protegida — precisa de token JWT.
     */
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> buscarAtual() {
        return ResponseEntity.ok(usuarioService.buscarAtual());
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioDTO> atualizarAtual(@Valid @RequestBody PerfilUpdateDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizarAtual(dto));
    }

    /*
     * GET /api/usuarios/{id}
     * Busca um usuário específico pelo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    /*
     * PUT /api/usuarios/{id}
     * Atualiza todos os dados de um usuário.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> atualizar(@PathVariable Long id,
                                                @Valid @RequestBody UsuarioRequestDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizar(id, dto));
    }

    /*
     * DELETE /api/usuarios/{id}
     * Remove um usuário pelo ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
