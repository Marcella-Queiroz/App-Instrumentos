// app/(tabs)/index.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View, StyleSheet, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, FlatList, RefreshControl
} from "react-native";
import { Text } from "../../components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { api } from "../../lib/api";

const BASE = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
const toAbs = (p) => (p && p.startsWith("http") ? p : `${BASE}${p || ""}`);

// Card do anúncio (agora vindo da API)
function InstrumentCard({ item, onPress }) {
  const cover = item?.photos?.[0] ? toAbs(item.photos[0]) : null;
  const cond = (item?.condition || "").toLowerCase();
  const usado = cond.includes("usad");

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      {cover ? (
        <Image source={{ uri: cover }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, { alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" }]}>
          <Text style={{ color: "#888" }}>Sem foto</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardPrice}>R$ {Number(item.price).toLocaleString("pt-BR")}</Text>
        <View style={styles.cardTags}>
          <View style={[styles.tag, usado ? styles.tagUsed : styles.tagNew]}>
            <Text style={[styles.tagText, usado ? styles.tagTextUsed : styles.tagTextNew]}>
              {item.condition || "—"}
            </Text>
          </View>
          <Text style={styles.cardType}>
            • {item.city || "—"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const listRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const { data } = await api.get("/listings");
      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.items)
        ? data.items
        : [];
      setItems(rows);
    } catch (e) {
      console.log("LISTINGS LOAD ERR:", e?.response?.status, e?.message, e?.response?.data);
      setError(
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Falha ao carregar anúncios."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); load(); }, []);

  // Conteúdo do topo (banner, categorias, etc)
  const Header = (
    <>
      <LinearGradient colors={["#4f46e5", "#7c3aed"]} style={styles.welcomeBanner}>
        <Text style={styles.welcomeTitle}>Olá! 👋</Text>
        <Text style={styles.welcomeSubtitle}>
          Encontre o instrumento perfeito ou venda o que não usa mais
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => listRef.current?.scrollToOffset?.({ offset: 0, animated: true })}
        >
          <Text style={styles.exploreButtonText}>Explorar instrumentos</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.section}>
        <FontAwesome name="line-chart" size={16} color="#f97316" />
        <Text style={styles.sectionTitle}>Categorias em alta</Text>
      </View>
      <View style={styles.categoriesContainer}>
        {[
          { name: "Guitarra", icon: "music", color: "#ef4444", ads: "—" },
          { name: "Piano", icon: "keyboard-o", color: "#8b5cf6", ads: "—" },
          { name: "Bateria", icon: "circle-o-notch", color: "#f97316", ads: "—" },
        ].map((cat) => (
          <View key={cat.name} style={styles.categoryCard}>
            <FontAwesome name={cat.icon} size={24} color={cat.color} />
            <Text style={styles.categoryName}>{cat.name}</Text>
            <Text style={styles.categoryAds}>{cat.ads}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <FontAwesome name="clock-o" size={16} color="#3b82f6" />
        <Text style={styles.sectionTitle}>Anúncios recentes</Text>
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Carregando anúncios…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text style={{ color: "tomato", textAlign: "center" }}>{error}</Text>
        <TouchableOpacity
          onPress={load}
          style={{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#111", borderRadius: 8 }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!items.length) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {Header}
        <View style={{ alignItems: "center", justifyContent: "center", padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Nenhum anúncio ainda</Text>
          <Text style={{ color: "#666", marginTop: 6, textAlign: "center" }}>
            Publique o primeiro anúncio na aba “Anunciar”.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <FlatList
      ref={listRef}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      data={items}
      keyExtractor={(it, idx) => String(it?.id ?? idx)}
      renderItem={({ item }) => (
        <InstrumentCard
          item={item}
          onPress={() => router.push({ pathname: "/listing/[id]", params: { id: String(item.id) } })}
        />
      )}
      ListHeaderComponent={Header}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", paddingHorizontal: 16 },
  welcomeBanner: { borderRadius: 12, padding: 20, marginTop: 16, marginBottom: 24 },
  welcomeTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  welcomeSubtitle: { color: "#e0e7ff", fontSize: 14, marginTop: 4 },
  exploreButton: { backgroundColor: "#fff", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, marginTop: 16, alignSelf: "flex-start" },
  exploreButtonText: { color: "#4f46e5", fontWeight: "bold", fontSize: 14 },

  section: { flexDirection: "row", alignItems: "center", marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 8, color: "#374151" },

  card: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 16, flexDirection: "row", padding: 10, shadowColor: "#9ca3af", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  cardImage: { width: 80, height: 80, borderRadius: 8 },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: "center", backgroundColor: "transparent" },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#1f2937" },
  cardPrice: { fontSize: 16, fontWeight: "bold", color: "#111827", marginVertical: 4 },
  cardTags: { flexDirection: "row", alignItems: "center", backgroundColor: "transparent" },
  tag: { borderRadius: 12, paddingVertical: 3, paddingHorizontal: 10, marginRight: 8 },
  tagNew: { backgroundColor: "#e0e7ff" },
  tagUsed: { backgroundColor: "#fef9c3" },
  tagText: { fontSize: 11, fontWeight: "bold" },
  tagTextNew: { color: "#4338ca" },
  tagTextUsed: { color: "#713f12" },
  cardType: { fontSize: 12, color: "#6b7280" },

  categoriesContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  categoryCard: { borderRadius: 12, padding: 16, alignItems: "center", width: "31%", shadowColor: "#9ca3af", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  categoryName: { marginTop: 8, fontSize: 13, fontWeight: "600", color: "#374151" },
  categoryAds: { fontSize: 11, color: "#6b7280", marginTop: 2 },
});
