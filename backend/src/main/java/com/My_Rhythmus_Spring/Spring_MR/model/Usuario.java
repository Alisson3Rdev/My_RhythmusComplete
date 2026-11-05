package com.My_Rhythmus_Spring.Spring_MR.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "tbuser")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Long idUser;

    @Column(name = "nome_user", nullable = false, length = 150)
    private String nomeUser;

    @Column(name = "apelido_user", nullable = false, length = 50)
    private String apelidoUser;

    @Column(name = "email_user", unique = true, nullable = false, length = 150)
    private String emailUser;

    @Column(name = "senha_user", nullable = false, length = 255)
    private String senhaUser;

    @Column(name = "nascimento_user", nullable = false)
    private java.time.LocalDate nascimentoUser;

    @Column(name = "phone_user", nullable = false, length = 20)
    private String phoneUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "sexo_user")
    private Sexo sexoUser;

    @Column(name = "altura_cm")
    private Integer alturaCm;

    @Column(name = "peso_kg", precision = 5, scale = 2)
    private BigDecimal pesoKg;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tbuser_esportes", joinColumns = @JoinColumn(name = "id_user", referencedColumnName = "id_user"))
    @Column(name = "esporte", nullable = false)
    private Set<String> esportesUser = new LinkedHashSet<>();

    // Getters e Setters
    public Long getIdUser() {
        return idUser; }
    public void setIdUser(Long idUser) {
        this.idUser = idUser; }

    public String getNomeUser() {
        return nomeUser; }
    public void setNomeUser(String nomeUser) {
        this.nomeUser = nomeUser;
    }


    public String getApelidoUser() {
        return apelidoUser; }
    public void setApelidoUser(String apelidoUser) {
        this.apelidoUser = apelidoUser; }


    public String getEmailUser() {
        return emailUser; }
    public void setEmailUser(String emailUser) {
        this.emailUser = emailUser; }


    public String getSenhaUser() {
        return senhaUser; }
    public void setSenhaUser(String senhaUser) {
        this.senhaUser = senhaUser; }


    public java.time.LocalDate getNascimentoUser() {
        return nascimentoUser; }
    public void setNascimentoUser(java.time.LocalDate nascimentoUser) {
        this.nascimentoUser = nascimentoUser; }


    public Sexo getSexoUser() {
        return sexoUser;
    }
    public void setSexoUser(Sexo sexoUser) {
        this.sexoUser = sexoUser;
    }

    public Integer getAlturaCm() { return alturaCm; }
    public void setAlturaCm(Integer alturaCm) { this.alturaCm = alturaCm; }
    public BigDecimal getPesoKg() { return pesoKg; }
    public void setPesoKg(BigDecimal pesoKg) { this.pesoKg = pesoKg; }
    public Set<String> getEsportesUser() { return esportesUser; }
    public void setEsportesUser(Set<String> esportesUser) { this.esportesUser = esportesUser == null ? new LinkedHashSet<>() : new LinkedHashSet<>(esportesUser); }

    public String getPhoneUser() {
        return phoneUser; }
    public void setPhoneUser(String phoneUser) {
        this.phoneUser = phoneUser; }
}
