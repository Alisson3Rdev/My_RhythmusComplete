import { Input } from "@/Components/Input";
import { Button } from "@/Components/button";
import Feather from "@expo/vector-icons/Feather";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
// KeyboardAwareScrollView: Faz a tela subir sozinha quando o teclado abre, sem tapar os inputs
import UsuarioService from "@/services/UsuarioService";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Index() {
    
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  // viewPassNormie: controla se a senha aparece (true) ou fica com bolinhas (false)
  const [viewPassNormie, setViewPassNormie] = useState(true);
  const router = useRouter();

  return (
    <KeyboardAwareScrollView
      // mainContainer: Fundo roxo que define a cor do topo
      style={styles.mainContainer}
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false} // Evita que a tela "pule" e mostre fundo branco no topo
    >
      {/* --- TOPO (IDENTIDADE VISUAL) --- */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.illustration}
        />
        <Text style={styles.headerTitle}>Bem-vindo!</Text>
      </View>

      {/* --- CONTEÚDO (CARD BRANCO ARREDONDADO) --- */}
      <View style={styles.contentCard}>
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Faça login para acessar sua conta</Text>

        <View style={styles.form}>
          {/* Campo E-mail */}
          <Text style={styles.label}>E-mail:</Text>
          <Input
            placeholder="Digite seu e-mail"
            placeholderTextColor="#606060"
            keyboardType="email-address"
            style={styles.inputGray} // Estilo cinza padronizado
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              console.log("E-mail digitado:", text);
            }}
          />

          {/* Campo Senha com botão de mostrar/esconder */}
          <Text style={styles.label}>Senha:</Text>
          <View style={styles.containerInPass}>
            <Input
              placeholder="Digite sua senha"
              placeholderTextColor="#606060"
              secureTextEntry={viewPassNormie} // Se true, esconde a senha
              style={[styles.inputGray, { flex: 1 }]} // flex: 1 faz o input ocupar o espaço todo antes do ícone
              value={senha}
              onChangeText={(text) => setSenha(text)}
            />
            {/* Ícone do Olho: Position Absolute coloca ele "dentro" do input na direita */}
            <Pressable
              style={styles.btnEyePass}
              onPress={() => setViewPassNormie(!viewPassNormie)}
            >
              <Feather
                name={viewPassNormie ? "eye" : "eye-off"}
                size={22}
                color="#404040"
              />
            </Pressable>
          </View>

          {/* Espaçamento estratégico para o botão de ação */}
          <View style={{ marginTop: 10 }}>
              <Button label="Entrar" onPress ={() =>{
              UsuarioService.login(email.trim(), senha)
                .then(() => router.replace("/tabs/home"))
                .catch((error) => {
                  Alert.alert("Não foi possível entrar", error.response?.data?.erro || error.message || "Verifique sua conexão e tente novamente.");
                });
              }} />
          </View>

          {/* Rodapé com link de navegação */}
          <Text style={styles.footerText}>
            Não tem uma conta?{" "}
            <Link style={styles.link} href="/signup">
              Cadastre-se aqui!
            </Link>
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#2E008B", // Cor principal do seu App
  },
  header: {
    alignItems: "center",
    height: 250, // Define o tamanho da área roxa visível
    justifyContent: "center",
    
  },
  illustration: {
    width: "80%",
    height: 160,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "600",
    marginTop: 10,
  },
  // O "Efeito de Folha": Fundo branco com um canto arredondado (80px)
  contentCard: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    borderTopRightRadius: 80, // Isso cria a curva que sobe no lado direito
    paddingHorizontal: 35,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  form: {
    gap: 12, // Espaço automático entre os elementos do formulário
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: -8, // Aproxima o texto do input abaixo
    marginLeft: 5,

  },
  // Estilo cinza arredondado que criamos para todos os inputs
  inputGray: {
    backgroundColor: "#BDBDBD",
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 15,
    borderWidth: 0,
    paddingBottom: 2,
  },
  containerInPass: {
    flexDirection: "row", // Coloca o Input e o Olho na mesma linha
    alignItems: "center",
   
  },
  btnEyePass: {
    position: "absolute", // Fixa o olho por cima do input
    right: 15, // Alinhado à direita
    paddingBottom: 7,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    color: "#585860",
    paddingBottom: 40, // Garante que o texto não cole no final da tela
  },
  link: {
    color: "#2E008B", // Link na mesma cor do tema roxo
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
