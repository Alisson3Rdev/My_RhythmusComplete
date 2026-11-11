import React, { useMemo, useState } from "react";
// Importamos os componentes básicos do celular
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
// O ScrollView inteligente que sobe a tela quando o teclado abre
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Ícones (usaremos a setinha 'chevron')
import Feather from "@expo/vector-icons/Feather";
// Importação dos seus componentes customizados
import { Input } from "@/Components/Input";
import { useRouter } from "expo-router";
import { getSignupDraft, setSignupDraft } from "@/services/signupDraft";
import { showFormAlert } from "@/services/formAlert";

export default function Info() {
  const router = useRouter();
  // Criando as "caixinhas" de memória para cada campo
  const { nome } = getSignupDraft() as { nome?: string };

  const [dataNascimento, setDataNascimento] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [sexo, setSexo] = useState("Sexo");
  const [phone, setPhone] = useState("");  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const showError = (field: string) => validationErrors[field] ? <Text style={styles.fieldError}>{validationErrors[field]}</Text> : null;
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear() - 18, new Date().getMonth(), 1));
  const [sexOpen, setSexOpen] = useState(false);
  const monthDays = useMemo(() => {
    const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(firstWeekday).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
  }, [month]);
  const formatDate = (day: number) => `${String(day).padStart(2, "0")}/${String(month.getMonth() + 1).padStart(2, "0")}/${month.getFullYear()}`;
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
              setValidationErrors((old) => ({ ...old, phone: "" }));
              setPhone(texto); // Salva na memória
              console.log("Telefone atualizado para:", texto); // TESTE NO TERMINAL
            }}
          />
          {showError("phone")}
          {/* Campo: Data */}
          <Text style={styles.label}>Data de nascimento:</Text>
          <Pressable style={styles.pickerFake} onPress={() => setCalendarOpen(true)}>
            <Text style={[styles.pickerText, !dataNascimento && { color: "#606060" }]}>{dataNascimento || "Selecione uma data"}</Text>
            <Feather name="calendar" size={21} color="#333" />
          </Pressable>
          {showError("birth")}

          {/* Campo: Sexo */}
          <Text style={styles.label}>Qual seu sexo?</Text>
          <Pressable
            style={styles.pickerFake}
            onPress={() => setSexOpen(true)}
          >
            {/* IMPORTANTE: Usar a variável {sexo} aqui para o texto mudar de "Sexo" para a escolha */}
            <Text style={styles.pickerText}>{sexo}</Text>
            <Feather name="chevron-down" size={28} color="#000000" />
          </Pressable>
          {showError("sex")}

          <Modal transparent visible={sexOpen} animationType="fade" onRequestClose={() => setSexOpen(false)}>
            <Pressable style={styles.modalBackdrop} onPress={() => setSexOpen(false)}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Selecione o sexo</Text>
                {["Masculino", "Feminino", "Prefiro não informar"].map((option) => (
                  <Pressable key={option} style={styles.optionRow} onPress={() => { setSexo(option); setSexOpen(false); }}>
                    <Text style={styles.optionText}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
          <Modal transparent visible={calendarOpen} animationType="fade" onRequestClose={() => setCalendarOpen(false)}>
            <Pressable style={styles.modalBackdrop} onPress={() => setCalendarOpen(false)}>
              <View style={styles.modalCard}>
                <View style={styles.calendarHeader}>
                  <Pressable onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><Feather name="chevron-left" size={24} color="#2E008B" /></Pressable>
                  <Text style={styles.modalTitle}>{month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</Text>
                  <Pressable onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><Feather name="chevron-right" size={24} color="#2E008B" /></Pressable>
                </View>
                <View style={styles.calendarGrid}>{["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <Text key={`weekday-${i}`} style={styles.weekday}>{d}</Text>)}
                  {monthDays.map((day, index) => day ? <Pressable key={index} style={styles.dayCell} onPress={() => { setDataNascimento(formatDate(day)); setCalendarOpen(false); }}><Text style={styles.dayText}>{day}</Text></Pressable> : <View key={index} style={styles.dayCell} />)}
                </View>
              </View>
            </Pressable>
          </Modal>

          {/* Campo: Altura */}
          <Text style={styles.label}>Qual sua altura?</Text>
          <Input
            placeholder="Altura (em cm)"
            placeholderTextColor="#606060"
            style={styles.inputGray}
            keyboardType="numeric"
            value={altura} // O que a caixa mostra
            onChangeText={(texto) => {
              setAltura(texto.replace(/[^0-9]/g, "")); // Altura em centímetros
              setValidationErrors((old) => ({ ...old, height: "" }));
              console.log("Altura atualizada para:", texto); // TESTE NO TERMINAL
            }}
          />
          {showError("height")}

          {/* Campo: Peso */}
          <Text style={styles.label}>Qual seu peso?</Text>
          <Input
            placeholder="Peso (em kg)"
            placeholderTextColor="#606060"
            keyboardType="numeric"
            style={styles.inputGray}
            value={peso} // O que a caixa mostra
            onChangeText={(texto) => {
              setPeso(texto.replace(/[^0-9.,]/g, "")); // Aceita casas decimais
              setValidationErrors((old) => ({ ...old, weight: "" }));
              console.log("Peso atualizado para:", texto); // TESTE NO TERMINAL
            }}
          />
          {showError("weight")}

          {/* --- BOTÃO DE PRÓXIMO --- */}
          {/* Na imagem, o botão é apenas uma seta preta no canto */}
          <View style={styles.navigationButtons}>
            <Pressable onPress={() => router.back()} style={styles.nextButton}><Feather name="chevron-left" size={50} color="black" /></Pressable>
          <View style={styles.nextButton}>
            <Pressable
            onPress={() => {
              const digits = phone.replace(/\D/g, "");
              if (!digits) {
                setValidationErrors({ phone: "Informe seu telefone com DDD." });
                return;
              }
              if (digits.length < 10 || digits.length > 11) {
                setValidationErrors({ phone: "Telefone inválido. Use DDD e número, totalizando 10 ou 11 dígitos." });
                return;
              }
              if (!dataNascimento) { setValidationErrors({ birth: "Selecione sua data de nascimento." }); return; }
              if (sexo === "Sexo") { setValidationErrors({ sex: "Selecione uma opção para sexo." }); return; }
              const birth = new Date(Number(dataNascimento.slice(6)), Number(dataNascimento.slice(3, 5)) - 1, Number(dataNascimento.slice(0, 2)));
              const age = (Date.now() - birth.getTime()) / (365.2425 * 24 * 60 * 60 * 1000);
              if (Number.isNaN(birth.getTime()) || birth > new Date() || age < 13 || age > 120) { setValidationErrors({ birth: "Data inválida. Informe uma idade entre 13 e 120 anos." }); return; }
              const heightValue = Number(altura);
              const weightValue = Number(peso.replace(",", "."));
              if (altura && (!Number.isInteger(heightValue) || heightValue < 80 || heightValue > 250)) { setValidationErrors({ height: "Altura inválida. Use um valor entre 80 e 250 cm." }); return; }
              if (peso && (!Number.isFinite(weightValue) || weightValue < 20 || weightValue > 400)) { setValidationErrors({ weight: "Peso inválido. Use um valor entre 20 e 400 kg." }); return; }
              setValidationErrors({});
              setPhone(digits);
              setSignupDraft({ dataNascimento, sexo, phone, altura, peso });
              router.push("/esportesTela");
            }}
          >
            <Feather name="chevron-right" size={50} color="black" />
          </Pressable>
          </View>
          </View>
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
    marginTop: 10,
    paddingBottom: 30,
  },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalCard: { width: "100%", maxWidth: 360, backgroundColor: "white", borderRadius: 18, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#222", textAlign: "center", textTransform: "capitalize" },
  optionRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
  optionText: { fontSize: 16, color: "#222" },
  calendarHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  weekday: { width: "14.285%", textAlign: "center", fontWeight: "700", color: "#666", paddingVertical: 8 },
  dayCell: { width: "14.285%", height: 42, alignItems: "center", justifyContent: "center" },
  dayText: { color: "#222", fontSize: 15 },
  navigationButtons: { flexDirection: "row", alignItems: "center", gap: 12 },
  backButton: { flexDirection: "row", alignItems: "center", padding: 8 },
  fieldError: { color: "#C62828", fontSize: 13, marginTop: -8, marginLeft: 6 },
});
