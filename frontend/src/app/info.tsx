import React, { useState } from "react";
// Importamos os componentes básicos do celular
import { Image, Pressable, StyleSheet, Text, View, Alert } from "react-native";
// O ScrollView inteligente que sobe a tela quando o teclado abre
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Ícones (usaremos a setinha 'chevron')
import Feather from "@expo/vector-icons/Feather";
// Importação dos seus componentes customizados
import { Input } from "@/Components/Input";
import { useRouter } from "expo-router";
import { getSignupDraft, setSignupDraft } from "@/services/signupDraft";

export default function Info() {
  const router = useRouter();
  // Criando as "caixinhas" de memória para cada campo
  const { nome } = getSignupDraft() as { nome?: string };

  const [dataNascimento, setDataNascimento] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [sexo, setSexo] = useState("Sexo");
  const [phone, setPhone] = useState("");  
  // Função para abrir o menu de seleção de sexo
return (
    <KeyboardAwareScrollView
      // O estilo principal define o fundo roxo da tela inteira
      style={styles.mainContainer}
      // Garante que o conteúdo estique se a tela for pequena
      contentContainerStyle={{ flexGrow: 1 }}
      // Desativa o efeito de "mola" no topo para a cor não descolar
      bounces={false}
    >
      {/* --- CABEÇALHO (PARTE ROXA) --- */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.illustration}
        />
        <Text style={styles.headerTitle}>Olá {nome}, insira suas informações</Text>
      </View>

      {/* --- CORPO (CARD BRANCO) --- */}
      {/* Este View é o que cria o efeito de "folha de papel" por cima do roxo */}
      <View style={styles.contentCard}>
        <View style={styles.form}>
          {/* Campo: Telefone */}
          <Text style={styles.label}>Qual seu telefone?</Text>
          <Input
            placeholder="(00) 00000-0000"
            placeholderTextColor="#606060"
            keyboardType="numeric"
            style={styles.inputGray}
            value={phone} // O que a caixa mostra
            onChangeText={(texto) => {
              setPhone(texto); // Salva na memória
              console.log("Telefone atualizado para:", texto); // TESTE NO TERMINAL
            }}
          />
          {/* Campo: Data */}
          <Text style={styles.label}>Data de nascimento:</Text>
          <Input
            placeholder="xx/xx/xxxx"
            placeholderTextColor="#606060" // <--- É assim que muda a cor do "xx/xx/xxxx"
            keyboardType="numbers-and-punctuation"
            style={styles.inputGray}
            value={dataNascimento} // O que a caixa mostra
            onChangeText={(valor) => {
              setDataNascimento(valor); // Salva na memória
              console.log("Data de nascimento atualizada para:", valor); // TESTE NO TERMINAL
            }}
          />

          {/* Campo: Sexo */}
          <Text style={styles.label}>Qual seu sexo?</Text>
          <Pressable
            style={styles.pickerFake}
            onPress={() => {
              Alert.alert("Selecione o Sexo", "Escolha uma opção:", [
                {
                  text: "Masculino",
                  onPress: () => {
                    setSexo("Masculino"); // Salva na memória (muda o texto na tela)
                    console.log("Sexo atualizado para: Masculino"); // Mostra no terminal
                  },
                },
                {
                  text: "Feminino",
                  onPress: () => {
                    setSexo("Feminino"); // Salva na memória (muda o texto na tela)
                    console.log("Sexo atualizado para: Feminino"); // Mostra no terminal
                  },
                },
                { text: "Cancelar", style: "cancel" },
              ]);
            }}
          >
            {/* IMPORTANTE: Usar a variável {sexo} aqui para o texto mudar de "Sexo" para a escolha */}
            <Text style={styles.pickerText}>{sexo}</Text>
            <Feather name="chevron-down" size={28} color="#000000" />
          </Pressable>

          {/* Campo: Altura */}
          <Text style={styles.label}>Qual sua altura?</Text>
          <Input
            placeholder="Altura (em cm)"
            placeholderTextColor="#606060"
            keyboardType="numeric"
            style={styles.inputGray}
            value={altura} // O que a caixa mostra
            onChangeText={(texto) => {
              setAltura(texto); // Salva na memória
              console.log("Altura atualizada para:", texto); // TESTE NO TERMINAL
            }}
          />

          {/* Campo: Peso */}
          <Text style={styles.label}>Qual seu peso?</Text>
          <Input
            placeholder="Peso (em kg)"
            placeholderTextColor="#606060"
            keyboardType="numeric"
            style={styles.inputGray}
            value={peso} // O que a caixa mostra
            onChangeText={(texto) => {
              setPeso(texto); // Salva na memória
              console.log("Peso atualizado para:", texto); // TESTE NO TERMINAL
            }}
          />

          {/* --- BOTÃO DE PRÓXIMO --- */}
          {/* Na imagem, o botão é apenas uma seta preta no canto */}
          <Pressable
            style={styles.nextButton}
            onPress={() => {
              if (!phone.trim() || !dataNascimento.trim()) {
                Alert.alert("Dados incompletos", "Informe o telefone e a data de nascimento.");
                return;
              }
              setSignupDraft({ dataNascimento, sexo, phone, altura, peso });
              router.push("/esportesTela");
            }}
          >
            <Feather name="chevron-right" size={50} color="black" />
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
{
}
const styles = StyleSheet.create({
  // 1. O fundo de toda a página
  mainContainer: {
    flex: 1,
    backgroundColor: "#2E008B",
  },
  // 2. Área do topo onde fica o logo e a frase branca
  header: {
    alignItems: "center",
    height: 270, // Fixe uma altura para o topo roxo
    justifyContent: "center", // Centraliza o conteúdo dentro desses 250px
    paddingBottom: 40,
  },
  illustration: {
    width: "90%", // ou "90%"
    height: 200,
    resizeMode: "contain",
    // Se quiser que ela suba um pouco sem mexer no resto:
    marginTop: -20,
  },
  headerTitle: {
    fontSize: 28,
    color: "#FFF", // Texto branco sobre o roxo
    fontWeight: "400",
    textAlign: "center",
    marginTop: 20,
  },
  // 3. O "Pulo do Gato": Este container branco sobe e arredonda só um lado
  contentCard: {
    flex: 1, // Faz o card ocupar o restante da tela
    backgroundColor: "#FFF", // Fundo branco
    borderTopRightRadius: 80, // Cria a curva acentuada no canto direito
    paddingHorizontal: 35,
    paddingTop: 40,
  },
  form: {
    gap: 15, // Espaçamento vertical automático entre os campos
  },
  label: {
    fontSize: 16,
    color: "#000000",
    marginBottom: -8, // Aproxima o texto do input abaixo dele
    marginLeft: 5,
  },
  // 4. Estilo dos inputs cinzas da imagem
  inputGray: {
    backgroundColor: "#BDBDBD", // Cor cinza de fundo
    borderRadius: 20, // Bordas bem redondas
    height: 45,
    paddingHorizontal: 15,
    borderWidth: 0, // Remove bordas laterais se houver
  },
  // 5. O seletor de Sexo (é um botão que parece um input)
  pickerFake: {
    backgroundColor: "#BDBDBD",
    height: 45,
    borderRadius: 20,
    flexDirection: "row", // Alinha texto e ícone lado a lado
    alignItems: "center",
    justifyContent: "space-between", // Joga o ícone para a ponta direita
    paddingHorizontal: 15,
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
    paddingLeft: 4,
  },
  // 6. Alinha a seta de navegação no canto inferior direito
  nextButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingBottom: 30,
  },
});
