package com.My_Rhythmus_Spring.Spring_MR.dto;

import com.My_Rhythmus_Spring.Spring_MR.model.Sexo;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PerfilUpdateDTO {
    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres")
    private String nomeUser;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    private String emailUser;

    @NotNull(message = "A data de nascimento é obrigatória")
    @Past(message = "A data de nascimento deve ser no passado")
    private LocalDate nascimentoUser;

    @NotNull(message = "O sexo é obrigatório")
    private Sexo sexoUser;

    @Min(value = 50, message = "A altura deve ser de pelo menos 50 cm")
    @Max(value = 260, message = "A altura deve ser de no máximo 260 cm")
    private Integer alturaCm;

    @DecimalMin(value = "20.0", message = "O peso deve ser de pelo menos 20 kg")
    @DecimalMax(value = "400.0", message = "O peso deve ser de no máximo 400 kg")
    private BigDecimal pesoKg;

    public String getNomeUser() { return nomeUser; }
    public void setNomeUser(String nomeUser) { this.nomeUser = nomeUser; }
    public String getEmailUser() { return emailUser; }
    public void setEmailUser(String emailUser) { this.emailUser = emailUser; }
    public LocalDate getNascimentoUser() { return nascimentoUser; }
    public void setNascimentoUser(LocalDate nascimentoUser) { this.nascimentoUser = nascimentoUser; }
    public Sexo getSexoUser() { return sexoUser; }
    public void setSexoUser(Sexo sexoUser) { this.sexoUser = sexoUser; }
    public Integer getAlturaCm() { return alturaCm; }
    public void setAlturaCm(Integer alturaCm) { this.alturaCm = alturaCm; }
    public BigDecimal getPesoKg() { return pesoKg; }
    public void setPesoKg(BigDecimal pesoKg) { this.pesoKg = pesoKg; }
}
