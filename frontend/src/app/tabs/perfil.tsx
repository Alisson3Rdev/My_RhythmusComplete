import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";

// Importação dos seus componentes customizados
import { Input } from "@/Components/Input";
import { Button } from "@/Components/button";
import userService from "@/services/UsuarioService";
export default function Profile() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Função auxiliar para tratar os parâmetros do Expo Router com segurança
  const getParam = (value: string | string[] | undefined, fallback: string) => 
    Array.isArray(value) ? value[0] : value || fallback;

  // Inicializando os estados direto com os valores recebidos (ou o padrão)
  // Isso evita que o useEffect trave os inputs ao digitar!
  const [nome, setNome] = useState(() => getParam(params.nome, "Matheus Norbak"));
  const [email, setEmail] = useState(() => getParam(params.email, "Matheus@exemplo.com"));
  const [dataNascimento, setDataNascimento] = useState(() => getParam(params.dataNascimento, "10/02/2009"));
  const [altura, setAltura] = useState(() => getParam(params.altura, "170"));
  const [peso, setPeso] = useState(() => getParam(params.peso, "62"));
  const [sexo, setSexo] = useState(() => getParam(params.sexo, "Masculino"));
  /*
  const [nome, setNome] = useState(userService.getNome());
  */
  // Modo de edição
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    userService.getProfile().then((profile) => {
      setNome(profile.nomeUser);
      setEmail(profile.emailUser);
      setDataNascimento(profile.nascimentoUser?.split("-").reverse().join("/") || "");
      setAltura(profile.alturaCm == null ? "" : String(profile.alturaCm));
      setPeso(profile.pesoKg == null ? "" : String(profile.pesoKg));
      setSexo(profile.sexoUser === "FEMININO" ? "Feminino" : profile.sexoUser === "PREFIRO_NAO_INFORMAR" ? "Prefiro não informar" : "Masculino");
    }).catch(() => {
      // Mantém os valores de demonstração enquanto o perfil remoto não estiver disponível.
    });
  }, []);

  // Função para abrir o seletor de sexo
  const selecionarSexo = () => {
    if (!isEditing) return;

    Alert.alert("Selecione o Sexo", "Escolha uma opção:", [
      { text: "Masculino", onPress: () => setSexo("Masculino") },
      { text: "Feminino", onPress: () => setSexo("Feminino") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  // Função para salvar as alterações
  const salvarAlteracoes = async () => {
    try {
      await userService.updateProfile({ nome, email, dataNascimento, altura, peso, sexo });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert("Não foi possível salvar", error.response?.data?.erro || error.message || "Tente novamente.");
    }
  };

  // Função para fazer logout
  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: () => { userService.logout(); router.replace("/"); } },
    ]);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.mainContainer}
      contentContainerStyle={{ flexGrow: 1 }}
      bounces={false}
    >
      {/* --- TOPO ROXO COM FOTO DE PERFIL --- */}
      <View style={styles.header}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={24} color="#FFF" />
        </Pressable>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Feather name="user" size={60} color="#2E008B" />
          </View>
          <Pressable style={styles.editAvatarIcon}>
            <Feather name="camera" size={16} color="#FFF" />
          </Pressable>
        </View>

        <Text style={styles.headerName}>{nome}</Text>
        <Text style={styles.headerEmail}>{email}</Text>
      </View>

      {/* --- CARD BRANCO (INFORMAÇÕES) --- */}
      <View style={styles.contentCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>Meu Perfil</Text>
          <Pressable onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editToggleButton}>
              {isEditing ? "Cancelar" : "Editar"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          {/* Campo Nome */}
          <Text style={styles.label}>Nome completo:</Text>
          <Input
            style={[styles.inputGray, !isEditing && styles.inputDisabled]}
            value={nome}
            onChangeText={setNome}
            editable={isEditing}
          />

          {/* Campo Data de Nascimento */}
          <Text style={styles.label}>Data de nascimento:</Text>
          <Input
            style={[styles.inputGray, !isEditing && styles.inputDisabled]}
            value={dataNascimento}
            onChangeText={setDataNascimento}
            editable={isEditing}
            keyboardType="numbers-and-punctuation"
          />

          {/* Campo Sexo */}
          <Text style={styles.label}>Sexo:</Text>
          <Pressable
            style={[
              styles.pickerFake, 
              !isEditing && styles.inputDisabled,
              { borderWidth: 0 }
            ]}
            onPress={selecionarSexo}
          >
            <Text style={styles.pickerText}>{sexo}</Text>
            {isEditing && <Feather name="chevron-down" size={24} color="#000" />}
          </Pressable>

          {/* Bloco lado a lado para Peso e Altura */}
          <View style={styles.row}>
            <View style={styles.columnInput}>
              <Text style={styles.label}>Altura (cm):</Text>
              <Input
                style={[styles.inputGray, !isEditing && styles.inputDisabled]}
                value={altura}
                onChangeText={setAltura}
                editable={isEditing}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.columnInput}>
              <Text style={styles.label}>Peso (kg):</Text>
              <Input
                style={[styles.inputGray, !isEditing && styles.inputDisabled]}
                value={peso}
                onChangeText={setPeso}
                editable={isEditing}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Botão de Salvar */}
          {isEditing && (
            <View style={{ marginTop: 20, paddingBottom: 30 }}>
              <Button label="Salvar Alterações" onPress={salvarAlteracoes} />
            </View>
          )}
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
    height: 260,
    justifyContent: "center",
    position: "relative",
    paddingTop: 20,
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    right: 25,
    padding: 5,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#404040",
    borderRadius: 15,
    padding: 6,
  },
  headerName: {
    fontSize: 22,
    color: "#FFF",
    fontWeight: "700",
  },
  headerEmail: {
    fontSize: 14,
    color: "#BDBDBD",
    marginTop: 2,
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    borderTopRightRadius: 80,
    paddingHorizontal: 35,
    paddingTop: 35,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#000",
  },
  editToggleButton: {
    fontSize: 16,
    color: "#2E008B",
    fontWeight: "bold",
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 15,
    color: "#000",
    marginLeft: 5,
  },
  inputGray: {
    backgroundColor: "#BDBDBD",
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 15,
    borderWidth: 0,
    color: "#000",
  },
  inputDisabled: {
    backgroundColor: "#E0E0E0",
    color: "#606060",
    opacity: 0.8,
  },
  pickerFake: {
    backgroundColor: "#BDBDBD",
    height: 45,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  columnInput: {
    flex: 1,
    gap: 8,
  },
});
