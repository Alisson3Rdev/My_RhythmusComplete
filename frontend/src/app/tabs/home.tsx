import { View, StyleSheet, Image, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Ícones focados em bem-estar e alongamento
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Home() {
  const router = useRouter();

  type Treino = {
    id: string;
    nome: string;
    sub: string;
    icone: React.ComponentProps<typeof MaterialCommunityIcons>["name"] | React.ComponentProps<typeof FontAwesome5>["name"];
    rota: string;
    tipoLib?: "material" | "fa5";
  };

  // 1. Seus Treinos (Personalizados / Salvos)
  const seusTreinos: Treino[] = [
    { id: "1", nome: "Flexibilidade", sub: "Membros Inferiores", icone: "accessibility", rota: "/treino.tsx" },
    { id: "2", nome: "Abertura Zero", sub: "Treino Avançado", icone: "running", rota: "/treino.tsx" },
    { id: "3", nome: "Coluna Alinhada", sub: "Postural Intensivo", icone: "human-male", tipoLib: "material", rota: "/treino.tsx" },
  ];

  // 2. Treinos do Dia a Dia (Rotinas diárias)
  const treinosDiaDia: Treino[] = [
    { id: "4", nome: "Alongar ao Acordar", sub: "5 min - Despertar", icone: "weather-sunny", tipoLib: "material", rota: "/treino.tsx" },
    { id: "5", nome: "Pausa no Trabalho", sub: "8 min - Cadeira", icone: "chair-rolling", tipoLib: "material", rota: "/treino.tsx" },
    { id: "6", nome: "Relaxante Noturno", sub: "10 min - Dormir bem", icone: "bed", tipoLib: "fa5", rota: "@" },
  ];

  // 3. Minha sugestão: Foco por Região (Alívio de dores específicas)
  const focoRegiao: Treino[] = [
    { id: "7", nome: "Alívio Lombar", sub: "Foco nas Costas", icone: "bone", tipoLib: "fa5", rota: "/treino.tsx" },
    { id: "8", nome: "Pescoço e Ombros", sub: "Antiestresse", icone: "head-neck", tipoLib: "material", rota: "/treino.tsx" },
    { id: "9", nome: "Mãos e Punhos", sub: "Prevenção LER", icone: "hand-paper", tipoLib: "fa5", rota: "/treino.tsx" },
  ];

  // Função auxiliar para desenhar o ícone correto baseado na biblioteca escolhida
  const renderIcon = (treino: Treino) => {
    if (treino.tipoLib === "material") {
      return <MaterialCommunityIcons name={treino.icone} size={28} color="#FFF" style={styles.icon} />;
    }
    return <FontAwesome5 name={treino.icone} size={26} color="#FFF" style={styles.icon} />;
  };

  // Componente interno para renderizar cada carrossel de forma limpa
  const renderCarrossel = (listaDados: Treino[]) => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carrosselContainer}
    >
      {listaDados.map((treino) => (
        <Pressable
          key={treino.id}
          style={styles.cardTreino}
          onPress={() => router.push("/treino")} // Rota genérica para teste, ajuste conforme necessário
        >
          {renderIcon(treino)}
          <Text style={styles.tituloTreino} numberOfLines={1}>{treino.nome}</Text>
          <Text style={styles.subtituloTreino} numberOfLines={1}>{treino.sub}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );

  return (
    <KeyboardAwareScrollView
      style={styles.mainContainer}
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
    >
      {/* --- CABEÇALHO (PARTE ROXA) --- */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.illustration}
        />
        <Text style={styles.headerTitle}>Qual alongamento vamos fazer hoje?</Text>
      </View>

      {/* --- CORPO (CARD BRANCO) --- */}
      <View style={styles.contentCard}>
        
        {/* SEÇÃO 1 */}
        <Text style={styles.sectionTitle}>Seus Treinos</Text>
        {renderCarrossel(seusTreinos)}

        {/* SEÇÃO 2 */}
        <Text style={styles.sectionTitle}>Treinos do Dia a Dia</Text>
        {renderCarrossel(treinosDiaDia)}

        {/* SEÇÃO 3 */}
        <Text style={styles.sectionTitle}>Foco por Região (Alívio)</Text>
        {renderCarrossel(focoRegiao)}
        
        {/* Espaçamento em branco seguro no final da tela */}
        <View style={{ height: 40 }} /> 
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
    paddingHorizontal: 20,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopRightRadius: 80,
    paddingHorizontal: 25,
    paddingTop: 35,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 5,
  },
  // Estilo que controla o espaçamento interno do carrossel horizontal
  carrosselContainer: {
    paddingLeft: 5,
    paddingRight: 20, 
    gap: 15, // Espaço entre um card e outro na horizontal
    paddingBottom: 10, // Espaço para a sombra não cortar embaixo
  },
  cardTreino: {
    backgroundColor: "#2E008B",
    borderRadius: 20,
    padding: 15,
    width: 150, // Largura fixa para que os próximos fiquem visíveis "espiando" no canto
    height: 130,
    justifyContent: "center",
    alignItems: "flex-start",
    
    // Efeito de sombra nos botões
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  icon: {
    marginBottom: 12,
    opacity: 0.9,
  },
  tituloTreino: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtituloTreino: {
    color: "#BDBDBD",
    fontSize: 12,
    marginTop: 2,
  },
});