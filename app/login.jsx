// app/login.jsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

const instruments = ['Guitarra/Violão', 'Baixo', 'Bateria', 'Teclado', 'Piano', 'Violino', 'Flauta', 'Saxofone', 'Trompete', 'Outros'];

export default function LoginScreen() {
  const [tab, setTab] = useState("login");
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    whatsapp: "",
    location: "",
    interests: [],
  });

  const router = useRouter();
  const { signIn } = useAuth();

  async function handleLogin() {
    try {
      await signIn(form.email, form.password);
      Alert.alert("Sucesso", "Login realizado!");
      router.replace("/(tabs)");
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Falha no login";
      Alert.alert("Erro", Array.isArray(msg) ? msg.join("\n") : msg);
    }
  }

  async function handleRegister() {
    try {
      // chame sua rota de cadastro (se quiser manter)
      // aqui deixei como antes, só lembre que o back talvez não aceite todos os campos extras
      // importaria api se quiser: const { api } = require("../lib/api");
      const { api } = await import("../lib/api");
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      Alert.alert("Conta criada", "Faça login com seu e-mail e senha.");
      setTab("login");
    } catch (err) {
      const raw = err?.response?.data?.error;
      const msg = Array.isArray(raw) ? raw.join("\n") : (raw || err?.message || "Falha no cadastro");
      Alert.alert("Erro", msg);
    }
  }

  const handleCheckbox = (instrument) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(instrument)
        ? prev.interests.filter((i) => i !== instrument)
        : [...prev.interests, instrument],
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image source={require("../assets/images/LogoTuneTrade.png")} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.subtitle}>Compre, venda e troque instrumentos musicais</Text>
          </View>

          <Text style={styles.welcome}>Bem-vindo</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, tab === "login" && styles.tabActive]} onPress={() => setTab("login")}>
              <Text style={tab === "login" ? styles.tabTextActive : styles.tabText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, tab === "register" && styles.tabActive]} onPress={() => setTab("register")}>
              <Text style={tab === "register" ? styles.tabTextActive : styles.tabText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

          {tab === "register" ? (
            <>
              <TextInput style={styles.input} placeholder="Nome completo" value={form.name} onChangeText={(name) => setForm({ ...form, name })} />
              <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={(email) => setForm({ ...form, email })} keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Senha" value={form.password} onChangeText={(password) => setForm({ ...form, password })} secureTextEntry />
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={(email) => setForm({ ...form, email })} keyboardType="email-address" autoCapitalize="none" />
              <TextInput style={styles.input} placeholder="Senha" value={form.password} onChangeText={(password) => setForm({ ...form, password })} secureTextEntry />
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#eaf0ff", alignItems: "center", justifyContent: "center", paddingVertical: 32 },
  logoContainer: { alignItems: "center", marginBottom: 16 },
  logoImage: { width: 180, height: 70, marginBottom: 2 },
  subtitle: { fontSize: 13, color: "#555", marginBottom: 8, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 20, width: 280, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  welcome: { fontSize: 16, fontWeight: "500", textAlign: "center", marginBottom: 12 },
  tabContainer: { flexDirection: "row", backgroundColor: "#f2f2f2", borderRadius: 16, marginBottom: 16, overflow: "hidden" },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center" },
  tabActive: { backgroundColor: "#fff" },
  tabText: { color: "#888", fontWeight: "500" },
  tabTextActive: { color: "#222", fontWeight: "bold" },
  input: { backgroundColor: "#f2f2f2", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 10, fontSize: 15 },
  button: { backgroundColor: "#111", borderRadius: 8, paddingVertical: 10, alignItems: "center", marginTop: 8, marginBottom: 4 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
