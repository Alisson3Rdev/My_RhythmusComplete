import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
// Importamos o Svg e o Circle para desenhar a barra de progresso
import Svg, { Circle } from "react-native-svg";
// LUGAR CERTO: Importação do roteador corrigida para não dar erro
import { useRouter } from "expo-router";

export default function WorkoutScreen() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Controle de tempo: O alongamento dura 30 segundos
  const TEMPO_TOTAL = 30; 
  const [segundosRestantes, setSegundosRestantes] = useState(TEMPO_TOTAL);

  // Efeito que roda o cronômetro segundo a segundo se o "Play" estiver ativo
  useEffect(() => {
    // CORREÇÃO DO SUBINHADO VERMELHO: Inicializado como null e tipado corretamente
    let intervalo: ReturnType<typeof setInterval> | null = null;

    if (isPlaying && segundosRestantes > 0) {
      intervalo = setInterval(() => {
        setSegundosRestantes((prev) => prev - 1);
      }, 1000);
    } else if (segundosRestantes === 0) {
      setIsPlaying(false); // Para o treino quando o tempo acaba
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [isPlaying, segundosRestantes]);

  // --- MATEMÁTICA DO CÍRCULO DE PROGRESSO ---
  const RAIO = 135; // Metade do tamanho do círculo cinza externo
  const CIRCUNFERENCIA = 2 * Math.PI * RAIO; // Comprimento total da linha do círculo
  
  // Calcula o quanto do azul deve sumir/aparecer com base no tempo
  const progresso = (TEMPO_TOTAL - segundosRestantes) / TEMPO_TOTAL;
  const strokeDashoffset = CIRCUNFERENCIA * (1 - progresso);

  // Formata os segundos para aparecerem bonitinhos como "00:30"
  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60).toString().padStart(2, "0");
    const segs = (segundos % 60).toString().padStart(2, "0");
    return `${mins}:${segs}`;
  };

  return (
    <View style={styles.container}>
      
      {/* --- CABEÇALHO (Ícones do Topo) --- */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/tabs/home")} style={styles.closeButton}>
          <Ionicons name="close" size={36} color="#FFF" />
        </Pressable>
        
        <Image
          source={require("@/assets/logo menor.png")}
          style={styles.logoTopo}
        />
      </View>

      {/* --- CARD CENTRAL DA ILUSTRAÇÃO COM ANIMAÇÃO --- */}
      <View style={styles.imageContainer}>
        <View style={styles.outerCircleContainer}>
          
          {/* O SVG desenha por cima das Views normais */}
          <Svg width={290} height={290} style={styles.svgAbsolute}>
            {/* 1. Círculo Cinza de Fundo (Borda Estática) */}
            <Circle
              cx={145}
              cy={145}
              r={RAIO}
              stroke="#B0B0B0"
              strokeWidth={15}
              fill="none"
            />
            {/* 2. Círculo Azul Claro Progressivo */}
            <Circle
              cx={145}
              cy={145}
              r={RAIO}
              stroke="#00D2FF" // O azul claro idêntico ao seu detalhe da logo
              strokeWidth={15}
              fill="none"
              strokeDasharray={CIRCUNFERENCIA}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" // Deixa as pontas da barra arredondadas
              transform="rotate(-90 145 145)" // Faz o progresso começar do topo (meia-noite)
            />
          </Svg>

          {/* O miolo branco com a foto continua idêntico aqui dentro */}
          <View style={styles.innerCircle}>
            <Image
              source={require("@/assets/alongamento posterior.png")} 
              style={styles.exerciseImage}
            />
          </View>
        </View>
      </View>

      {/* --- TEXTOS INFORMATIVOS --- */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.exerciseTitle}>Alongamento posterior</Text>
          <Pressable onPress={() => console.log("Info do exercício")}>
            <View style={styles.infoIconCircle}>
              <Text style={styles.infoIconText}>!</Text>
            </View>
          </Pressable>
        </View>
        <Text style={styles.xpText}>+ 10 XP</Text>
      </View>

      {/* --- CONTROLES E CRONÔMETRO (RODAPÉ) --- */}
      <View style={styles.footer}>
        {/* Mostra o tempo real regredindo */}
        <Text style={styles.timerText}>{formatarTempo(segundosRestantes)}</Text>

        {/* Botões de Controle de Mídia */}
        <View style={styles.controlsRow}>
          <Pressable onPress={() => setSegundosRestantes(TEMPO_TOTAL)}>
            <Feather name="skip-back" size={40} color="#FFF" />
          </Pressable>

          <Pressable onPress={() => setIsPlaying(!isPlaying)} style={styles.playPauseBtn}>
            <Feather 
              name={isPlaying ? "pause" : "play"} 
              size={50} 
              color="#FFF" 
            />
          </Pressable>

          <Pressable onPress={() => setSegundosRestantes(0)}>
            <Feather name="skip-forward" size={40} color="#FFF" />
          </Pressable>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A0066", 
    paddingHorizontal: 24,
    paddingTop: 50, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 80,          
    position: "relative", 
  },
  closeButton: {
    zIndex: 10, 
  },
  logoTopo: {
    position: "absolute",  
    right: -10,            
    top: 5,                
    width: 80, // Caso queira a logo maior, mude para 200            
    height: 70,            
    resizeMode: "contain", 
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircleContainer: {
    width: 290,
    height: 290,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  svgAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  innerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  exerciseImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  exerciseTitle: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "500",
  },
  infoIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  infoIconText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  xpText: {
    fontSize: 14,
    color: "#D0D0D0",
    marginTop: 8,
    fontWeight: "600",
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
  },
  timerText: {
    fontSize: 48,
    color: "#FFF",
    fontWeight: "300",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  playPauseBtn: {
    marginHorizontal: 10,
  },
});