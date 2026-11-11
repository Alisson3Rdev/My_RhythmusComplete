import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { hasAuthSession } from "@/services/api";

export default function Layout() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  useEffect(() => {
    setAuthorized(hasAuthSession());
  }, []);
  if (authorized === null) return null;
  if (!authorized) return <Redirect href="/" />;

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#2E008B", headerShown: false }}>
      <Tabs.Screen
        name="IaScreen"
        options={{ tabBarIcon: ({ color, size }) => <Feather name="cpu" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="desempenho"
        options={{ tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="home"
        options={{ tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{ tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} /> }}
      />
    </Tabs>
  );
}
