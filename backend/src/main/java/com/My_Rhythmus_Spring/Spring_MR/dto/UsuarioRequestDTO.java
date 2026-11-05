package com.My_Rhythmus_Spring.Spring_MR.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;
import com.My_Rhythmus_Spring.Spring_MR.model.Sexo;

public class UsuarioRequestDTO {

    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres")
    private String nomeUser;

    @NotBlank(message = "O apelido é obrigatório")
    @Size(max = 50, message = "O apelido deve ter no máximo 50 caracteres")
    private String apelidoUser;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    private String emailUser;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String senhaUser;

    @NotNull(message = "A data de nascimento é obrigatória")
    @Past(message = "A data de nascimento deve ser no passado")
    private LocalDate nascimentoUser;

    @NotBlank(message = "O telefone é obrigatório")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Telefone inválido")
    private String phoneUser;

    private Sexo sexoUser;

    @Min(value = 50, message = "A altura deve ser de pelo menos 50 cm")
    @Max(value = 260, message = "A altura deve ser de no máximo 260 cm")
    private Integer alturaCm;

    @DecimalMin(value = "20.0", message = "O peso deve ser de pelo menos 20 kg")
    @DecimalMax(value = "400.0", message = "O peso deve ser de no máximo 400 kg")
    private BigDecimal pesoKg;

    @Size(max = 10, message = "Informe no máximo 10 esportes")
    private List<@NotBlank String> esportesUser;

    public String getNomeUser() { return nomeUser; }
    public void setNomeUser(String nomeUser) { this.nomeUser = nomeUser; }
    public String getApelidoUser() { return apelidoUser; }
    public void setApelidoUser(String apelidoUser) { this.apelidoUser = apelidoUser; }
    public String getEmailUser() { return emailUser; }
    public void setEmailUser(String emailUser) { this.emailUser = emailUser; }
    public String getSenhaUser() { return senhaUser; }
    public void setSenhaUser(String senhaUser) { this.senhaUser = senhaUser; }
    public LocalDate getNascimentoUser() { return nascimentoUser; }
    public void setNascimentoUser(LocalDate nascimentoUser) { this.nascimentoUser = nascimentoUser; }
    public Sexo getSexoUser() { return sexoUser; }
    public void setSexoUser(Sexo sexoUser) { this.sexoUser = sexoUser; }
    public Integer getAlturaCm() { return alturaCm; }
    public void setAlturaCm(Integer alturaCm) { this.alturaCm = alturaCm; }
    public BigDecimal getPesoKg() { return pesoKg; }
    public void setPesoKg(BigDecimal pesoKg) { this.pesoKg = pesoKg; }
    public List<String> getEsportesUser() { return esportesUser; }
    public void setEsportesUser(List<String> esportesUser) { this.esportesUser = esportesUser; }
    public String getPhoneUser() { return phoneUser; }
    public void setPhoneUser(String phoneUser) { this.phoneUser = phoneUser; }
}
