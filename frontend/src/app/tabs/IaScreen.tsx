import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PromptIA() {
  const [prompt, setPrompt] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviarPrompt = () => {
    if (!prompt.trim()) return;

    setCarregando(true);
    console.log("Prompt enviado:", prompt);

    // Lógica para enviar para a sua API de IA aqui
    setTimeout(() => {
      setCarregando(false);
      setPrompt("");
    }, 1500);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.mainContainer}
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* --- CABEÇALHO (PARTE ROXA COM LOGO CENTRALIZADA) --- */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.illustration}
        />
        <Text style={styles.headerTitle}>O que você deseja criar hoje?</Text>
      </View>

      {/* --- CORPO (CARD BRANCO) --- */}
      <View style={styles.contentCard}>
        <Text style={styles.label}>
          Descreva o treino ou rotina que você precisa:
        </Text>

        {/* CAMPO DE TEXTO DO PROMPT */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ex: Crie um treino de 10 min para aliviar dores nas costas após o trabalho..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={prompt}
            onChangeText={setPrompt}
          />

          {/* BOTÃO DE ENVIAR */}
          <Pressable
            style={[
              styles.sendButton,
              !prompt.trim() && styles.sendButtonDisabled,
            ]}
            onPress={enviarPrompt}
            disabled={!prompt.trim() || carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Ionicons name="send" size={20} color="#FFF" />
            )}
          </Pressable>
        </View>

        {/* SUGESTÕES RÁPIDAS */}
        <Text style={styles.suggestionsTitle}>Sugestões rápidas:</Text>
        <View style={styles.suggestionsContainer}>
          {[
            "Alongamento de 5 min para acordar",
            "Treino de postura para escritório",
            "Alívio de tensão no pescoço",
          ].map((sugestao, index) => (
            <Pressable
              key={index}
              style={styles.chip}
              onPress={() => setPrompt(sugestao)}
            >
              <Text style={styles.chipText}>{sugestao}</Text>
            </Pressable>
          ))}
        </View>

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
    paddingBottom: 20,
  },
  illustration: {
    width: "80%",
    height: 160,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopRightRadius: 80,
    paddingHorizontal: 25,
    paddingTop: 35,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 15,
  },
  inputContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 180,
    justifyContent: "space-between",
  },
  input: {
    fontSize: 15,
    color: "#333",
    minHeight: 110,
  },
  sendButton: {
    backgroundColor: "#2E008B",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonDisabled: {
    backgroundColor: "#BDBDBD",
    elevation: 0,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 10,
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#F0EBF8",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#D6C7F2",
  },
  chipText: {
    color: "#2E008B",
    fontSize: 13,
    fontWeight: "500",
  },
});