import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Feather from "@expo/vector-icons/Feather";
import UsuarioService from "@/services/UsuarioService";
import { clearSignupDraft, getSignupDraft } from "@/services/signupDraft";

// IMPORTANTE: Importando as duas famílias de ícones que você pediu
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
export default function Esportes() {
  const router = useRouter();
  const draft = getSignupDraft();

  const [esportesSelecionados, setEsportesSelecionados] = useState<string[]>([]);

  // Nova lista mapeada com os ícones específicos que você enviou
  const listaEsportes = [
    { 
      id: "futebol", 
      nome: "Futebol", 
      lib: "FontAwesome", 
      icone: "soccer-ball-o" 
    },
    { 
      id: "basquete", 
      nome: "Basquete", 
      lib: "FontAwesome5", 
      icone: "basketball-ball" 
    },
    { 
      id: "volei", 
      nome: "Vôlei", 
      lib: "FontAwesome5", 
      icone: "volleyball-ball" 
    },
    { 
      id: "natacao", 
      nome: "Natação", 
      lib: "FontAwesome5", 
      icone: "swimmer" 
    },
    { 
      id: "corrida", 
      nome: "Corrida", 
      lib: "FontAwesome5", 
      icone: "running" 
    },
    { 
      id: "outros", 
      nome: "Outros", 
      lib: "FontAwesome5", 
      icone: "running" // Ícone genérico para outros, mude se preferir
    },
  ];

  const alternarEsporte = (id: string) => {
    if (esportesSelecionados.includes(id)) {
      setEsportesSelecionados(esportesSelecionados.filter((item) => item !== id));
    } else {
      setEsportesSelecionados([...esportesSelecionados, id]);
    }
  };
  return (
    <KeyboardAwareScrollView
      style={styles.mainContainer}
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
    >
      {/* --- CABEÇALHO --- */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.illustration}
        />
        <Text style={styles.headerTitle}>Quais esportes você pratica?</Text>
      </View>

      {/* --- CORPO --- */}
      <View style={styles.contentCard}>
        <View style={styles.form}>
          <Text style={styles.label}>Selecione uma ou mais opções:</Text>

          <View style={styles.checkboxContainer}>
            {listaEsportes.map((esporte) => {
              const estaSelecionado = esportesSelecionados.includes(esporte.id);

              // Cor dinâmica: se selecionado usa o roxo do app, se não, usa cinza escuro
              const corIconeEsporte = estaSelecionado ? "#2E008B" : "#555555";

              return (
                <Pressable
                  key={esporte.id}
                  style={styles.checkboxOption}
                  onPress={() => alternarEsporte(esporte.id)}
                >
                  {/* 1. Caixa de seleção (Check/Square) */}
                  <Feather
                    name={estaSelecionado ? "check-square" : "square"}
                    size={26}
                    color={estaSelecionado ? "#2E008B" : "#606060"}
                  />

                  {/* 2. Ícone decorativo do esporte (Renderização condicional da biblioteca) */}
                  {esporte.lib === "FontAwesome" ? (
                    <FontAwesome
                      name={esporte.icone as React.ComponentProps<typeof FontAwesome>["name"]}
                      size={22}
                      color={corIconeEsporte}
                      style={styles.sportIcon}
                    />
                  ) : (
                    <FontAwesome5
                      name={esporte.icone as React.ComponentProps<typeof FontAwesome5>["name"]}
                      size={22}
                      color={corIconeEsporte}
                      style={styles.sportIcon}
                    />
                  )}
                  {/* 3. Texto do esporte */}
                  <Text style={styles.checkboxText}>{esporte.nome}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* --- BOTÃO DE PRÓXIMO --- */}
          <View style={styles.navigationButtons}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={28} color="#2E008B" /><Text style={styles.backText}>Voltar</Text>
          </Pressable>
          <Pressable
            style={styles.nextButton}
            onPress={() =>
              UsuarioService.cadastrar({ ...draft, esportes: esportesSelecionados })
                .then((resposta) => {
                  console.log("Usuário cadastrado com sucesso:", resposta);
                  clearSignupDraft();
                  router.replace("/tabs/home");
                }
                )
                .catch((erro) => {
                  console.error("Erro ao cadastrar usuário:", erro);
                  Alert.alert("Não foi possível concluir o cadastro", erro.response?.data?.erro || erro.message || "Tente novamente.");
                })
            }
          >
            <Feather name="chevron-right" size={50} color="black" />
          </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#2E008B",
  },
  header: {
    alignItems: "center",
    height: 270,
    justifyContent: "center",
    paddingBottom: 40,
  },
  illustration: {
    width: "90%",
    height: 200,
    resizeMode: "contain",
    marginTop: -20,
  },
  headerTitle: {
    fontSize: 26,
    color: "#FFF",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopRightRadius: 80,
    paddingHorizontal: 35,
    paddingTop: 40,
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 5,
    marginLeft: 5,
  },
  checkboxContainer: {
    gap: 12,
    marginTop: 5,
  },
  checkboxOption: {
    backgroundColor: "#BDBDBD",
    height: 50,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  sportIcon: {
    marginLeft: 10, // Afasta o ícone do esporte da caixinha de check
    marginRight: 5,  // Afasta o ícone do esporte do texto lateral
    width: 28,       // Largura fixa para deixar todos os textos alinhados perfeitamente
    textAlign: "center"
  },
  checkboxText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  nextButton: {
    marginTop: 20,
    paddingBottom: 30,
  },
  navigationButtons: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { flexDirection: "row", alignItems: "center", padding: 8 },
  backText: { color: "#2E008B", fontWeight: "600" },
});
