import { Button } from "@/Components/button";
import { Input } from "@/Components/Input";
import Feather from "@expo/vector-icons/Feather";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react"; // Adicionado React para padronização
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import userService from "@/services/UsuarioService" // caminho correto aqui
import { setSignupDraft } from "@/services/signupDraft";
import { showFormAlert } from "@/services/formAlert";
export default function Signup() {
  const router = useRouter(); // Agora dentro da função, como deve ser
  const [viewPass, setViewPass] = useState(true);

  // Estados para capturar os dados (como fizemos na tela Info)
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [apelido, setApelido] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const showError = (field: string) => formErrors[field] ? <Text style={styles.fieldError}>{formErrors[field]}</Text> : null;

  function onViewPass() {
    setViewPass(!viewPass);
  }
  return (
    <KeyboardAwareScrollView
      style={styles.mainContainer} // Fundo roxo principal
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
    >
      {/* --- TOPO ROXO COM LOGO --- */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.illustration}
        />
        <Text style={styles.headerTitle}>Crie sua conta</Text>
      </View>

      {/* --- CARD BRANCO (CONTEÚDO) --- */}
      <View style={styles.contentCard}>
        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>
          Preencha os campos para começar sua jornada
        </Text>

        <View style={styles.form}>
          {/* Campo Nome */}
          <Text style={styles.label}>Primeiro nome:</Text>
          <Input
            placeholder="Ex: João "
            placeholderTextColor="#606060"
            style={styles.inputGray}
            value={nome}
            onChangeText={(value) => { setNome(value); setFormErrors((old) => ({ ...old, nome: "" })); }}
          />
          {showError("nome")}
          <Text style={styles.label}>Seu apelido</Text>
          <Input
            placeholder="Ex: joao123 "
            placeholderTextColor="#606060"
            style={styles.inputGray}
            value={apelido}
            onChangeText={(value) => { setApelido(value); setFormErrors((old) => ({ ...old, apelido: "" })); }}
          />
          {showError("apelido")}
          

          {/* Campo E-mail */}
          <Text style={styles.label}>E-mail:</Text>
          <Input
            placeholder="seu-email@email.com"
            placeholderTextColor="#606060"
            keyboardType="email-address"
            style={styles.inputGray}
            value={email}
            onChangeText={(value) => { setEmail(value); setFormErrors((old) => ({ ...old, email: "" })); }}
            
          />
          {showError("email")}

          {/* Campo Senha */}
          <Text style={styles.label}>Senha:</Text>
          <View style={styles.containerInPass}>
            <Input
              placeholder="Crie uma senha"
              placeholderTextColor="#606060"
              secureTextEntry={viewPass}
              style={[styles.inputGray, { flex: 1 }]}
              value={senha}
              onChangeText={(value) => { setSenha(value); setFormErrors((old) => ({ ...old, senha: "" })); }}
            />
            <Pressable style={styles.btnEyePass} onPress={onViewPass}>
              <Feather
                name={viewPass ? "eye" : "eye-off"}
                size={22}
                color="#404040"
              />
            </Pressable>
          </View>
          {showError("senha")}

          {/* Campo Confirmar Senha */}
          <Text style={styles.label}>Confirmar Senha:</Text>
          <View style={styles.containerInPass}>
            <Input
              placeholder="Repita a senha"
              placeholderTextColor="#606060"
              secureTextEntry={viewPass}
              style={[styles.inputGray, { flex: 1 }]}
              value={confirmarSenha}
              onChangeText={(value) => { setConfirmarSenha(value); setFormErrors((old) => ({ ...old, confirmarSenha: "" })); }}
            />
          </View>
          {showError("confirmarSenha")}

       {/* campo do botão */}
      <View style={{ marginTop: 10 }}>
        <Button 
          label="Próximo" 
          onPress={() => {
            const errors: Record<string, string> = {};
            if (!nome.trim()) errors.nome = "Informe seu primeiro nome.";
            else if (nome.trim().length < 2) errors.nome = "Use pelo menos 2 caracteres.";
            if (!apelido.trim()) errors.apelido = "Informe seu apelido.";
            else if (apelido.trim().length < 2) errors.apelido = "Use pelo menos 2 caracteres.";
            if (!email.trim()) errors.email = "Informe seu e-mail.";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Digite um e-mail válido.";
            if (!senha) errors.senha = "Informe uma senha.";
            else if (senha.length < 6) errors.senha = "A senha deve ter pelo menos 6 caracteres.";
            if (!confirmarSenha) errors.confirmarSenha = "Confirme sua senha.";
            else if (senha !== confirmarSenha) errors.confirmarSenha = "As senhas não coincidem.";
            setFormErrors(errors);
            if (Object.keys(errors).length) return;
            
            // Se passou por tudo, ele "viaja" para a próxima tela
            // Mantém a senha fora dos parâmetros/URL de navegação.
            setSignupDraft({ nome, apelido, email, senha });
            router.push("/info");
      
            console.log("Cadastro validado com sucesso para:", nome);
          }} 
        />
      </View>

          {/* Link para voltar ao Login */}
          <Text style={styles.footerText}>
            Já tem uma conta?{" "}
            <Link style={styles.link} href="/">
              Entre aqui!
            </Link>
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  // Container principal com a cor roxa do tema
  mainContainer: {
    flex: 1,
    backgroundColor: "#2E008B",
  },
  // Cabeçalho centralizado para a logo
  header: {
    alignItems: "center",
    height: 220,
    justifyContent: "center",
  },
  illustration: {
    width: "70%",
    height: 140,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 22,
    color: "#FFF",
    fontWeight: "600",
    marginTop: 5,
  },
  // Card branco com a curva de 80px no canto superior direito
  contentCard: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    borderTopRightRadius: 80,
    paddingHorizontal: 35,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  form: {
    gap: 12,
  },
  // Labels idênticos aos da tela de Info
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: -8,
    marginLeft: 5,
  },
  // Input cinza arredondado
  inputGray: {
    backgroundColor: "#BDBDBD",
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 15,
    borderWidth: 0,
  },
  containerInPass: {
    flexDirection: "row",
    alignItems: "center",
  },
  btnEyePass: {
    position: "absolute",
    right: 15,
    paddingBottom: 7,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
    color: "#585860",
    paddingBottom: 30,
  },
  link: {
    color: "#2E008B",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  fieldError: { color: "#C62828", fontSize: 13, marginTop: 6, marginLeft: 6 },
});
