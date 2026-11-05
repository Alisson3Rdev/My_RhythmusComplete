package com.My_Rhythmus_Spring.Spring_MR.service;

import com.My_Rhythmus_Spring.Spring_MR.dto.UsuarioDTO;
import com.My_Rhythmus_Spring.Spring_MR.dto.UsuarioRequestDTO;
import com.My_Rhythmus_Spring.Spring_MR.dto.PerfilUpdateDTO;
import com.My_Rhythmus_Spring.Spring_MR.model.Usuario;
import com.My_Rhythmus_Spring.Spring_MR.model.Sexo;
import com.My_Rhythmus_Spring.Spring_MR.exception.ApiException;
import org.springframework.http.HttpStatus;
import com.My_Rhythmus_Spring.Spring_MR.repository.UsuarioRepository;
import com.My_Rhythmus_Spring.Spring_MR.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioDTO cadastrar(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmailUser(dto.getEmailUser())) {
            throw new ApiException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setNomeUser(dto.getNomeUser());
        usuario.setApelidoUser(dto.getApelidoUser());
        usuario.setEmailUser(dto.getEmailUser());
        usuario.setSenhaUser(passwordEncoder.encode(dto.getSenhaUser()));
        usuario.setNascimentoUser(dto.getNascimentoUser());
        usuario.setPhoneUser(dto.getPhoneUser());
        usuario.setSexoUser(dto.getSexoUser() == null ? Sexo.PREFIRO_NAO_INFORMAR : dto.getSexoUser());
        usuario.setAlturaCm(dto.getAlturaCm());
        usuario.setPesoKg(dto.getPesoKg());
        usuario.setEsportesUser(dto.getEsportesUser() == null ? Set.of() : Set.copyOf(dto.getEsportesUser()));

        Usuario salvo = usuarioRepository.save(usuario);
        return toDTO(salvo);
    }

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        String emailLogado = SecurityUtils.getEmailUsuarioLogado();
        if (!usuario.getEmailUser().equals(emailLogado)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Acesso negado.");
        }

        return toDTO(usuario);
    }

    public UsuarioDTO buscarAtual() {
        String emailLogado = SecurityUtils.getEmailUsuarioLogado();
        Usuario usuario = usuarioRepository.findByEmailUser(emailLogado)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
        return toDTO(usuario);
    }

    public UsuarioDTO atualizarAtual(PerfilUpdateDTO dto) {
        String emailAtual = SecurityUtils.getEmailUsuarioLogado();
        Usuario usuario = usuarioRepository.findByEmailUser(emailAtual)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        if (!emailAtual.equalsIgnoreCase(dto.getEmailUser())
                && usuarioRepository.existsByEmailUser(dto.getEmailUser())) {
            throw new ApiException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        }

        usuario.setNomeUser(dto.getNomeUser());
        usuario.setEmailUser(dto.getEmailUser());
        usuario.setNascimentoUser(dto.getNascimentoUser());
        usuario.setSexoUser(dto.getSexoUser());
        if (dto.getAlturaCm() != null) usuario.setAlturaCm(dto.getAlturaCm());
        if (dto.getPesoKg() != null) usuario.setPesoKg(dto.getPesoKg());
        return toDTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        String emailLogado = SecurityUtils.getEmailUsuarioLogado();
        if (!usuario.getEmailUser().equals(emailLogado)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Acesso negado.");
        }

        usuario.setNomeUser(dto.getNomeUser());
        usuario.setApelidoUser(dto.getApelidoUser());
        usuario.setEmailUser(dto.getEmailUser());
        usuario.setNascimentoUser(dto.getNascimentoUser());
        usuario.setPhoneUser(dto.getPhoneUser());
        usuario.setSexoUser(dto.getSexoUser() == null ? Sexo.PREFIRO_NAO_INFORMAR : dto.getSexoUser());
        usuario.setAlturaCm(dto.getAlturaCm());
        usuario.setPesoKg(dto.getPesoKg());
        usuario.setEsportesUser(dto.getEsportesUser() == null ? Set.of() : Set.copyOf(dto.getEsportesUser()));

        if (dto.getSenhaUser() != null && !dto.getSenhaUser().isBlank()) {
            usuario.setSenhaUser(passwordEncoder.encode(dto.getSenhaUser()));
        }

        return toDTO(usuarioRepository.save(usuario));
    }

    public void deletar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        String emailLogado = SecurityUtils.getEmailUsuarioLogado();
        if (!usuario.getEmailUser().equals(emailLogado)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Acesso negado.");
        }

        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO toDTO(Usuario u) {
        return new UsuarioDTO(
                u.getIdUser(),
                u.getNomeUser(),
                u.getApelidoUser(),
                u.getEmailUser(),
                u.getNascimentoUser(),
                u.getPhoneUser(),
                u.getSexoUser(),
                u.getAlturaCm(),
                u.getPesoKg(),
                u.getEsportesUser()
        );
    }
}
