import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

/** Paleta clara como no print */
const COLORS = {
  bg: "#F6F7FB",
  card: "#FFFFFF",
  stroke: "#E6E8EF",
  text: "#1C1D21",
  muted: "#7C8295",
  chip: "#F0F2F7",
  yellow: "#FFD166",
  white: "#FFFFFF",
  brand: "#0F1222",
};

const mockUser = {
  nome: "João Silva",
  iniciais: "JS",
  rating: 4.8,
  avaliacoes: 24,
  desde: "14/01/2023",
  cidade: "São Paulo, SP",
  email: "joao@email.com",
  telefone: "11999999999",
  interesses: ["guitarra", "baixo"],
  stats: [
    { label: "Anúncios", value: 2 },
    { label: "Visualizações", value: 156 },
    { label: "Curtidas", value: 20 },
  ],
};

const mockAds = [
  {
    id: "1",
    titulo: "Guitarra Fender Stratocaster",
    preco: "R$ 3.500",
    condicao: "Seminovo",
    tipo: "Venda",
  },
  {
    id: "2",
    titulo: "Violão Yamaha FG830",
    preco: "R$ 950",
    condicao: "Usado",
    tipo: "Venda",
  },
];

const mockReviews = [
  {
    id: "r1",
    autor: "Maria Santos",
    iniciais: "MS",
    estrelas: 5,
    data: "19/01/2025",
    texto:
      "Excelente vendedor! Instrumento exatamente como descrito e entrega rápida.",
    util: 14,
    inutil: 1,
  },
];

export default function Perfil() {
  const [tab, setTab] = useState("anuncios"); // "anuncios" | "avaliacoes"

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Card do usuário */}
        <View style={styles.userCard}>
          <View style={{ flexDirection: "row", gap: 14 }}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{mockUser.iniciais}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.userName}>{mockUser.nome}</Text>

                {/* FUTURA IMPLEMENTAÇÃO DE API: editar perfil */}
                <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
                  <Feather name="edit-2" size={14} color={COLORS.brand} />
                  <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inlineRow}>
                <Ionicons name="star" size={14} color="#F2B705" />
                <Text style={styles.inlineText}>
                  {mockUser.rating}{" "}
                  <Text style={styles.muted}>({mockUser.avaliacoes} avaliações)</Text>
                </Text>
                <View style={styles.dot} />
                <MaterialIcons
                  name="event-available"
                  size={14}
                  color={COLORS.muted}
                />
                <Text style={styles.muted}>Desde {mockUser.desde}</Text>
              </View>

              <View style={styles.inlineRow}>
                <Ionicons name="location-outline" size={16} color={COLORS.muted} />
                <Text style={styles.inlineText}>{mockUser.cidade}</Text>
              </View>

              <View style={styles.inlineRow}>
                <Ionicons name="mail-outline" size={16} color={COLORS.muted} />
                <Text style={styles.inlineText}>{mockUser.email}</Text>
              </View>

              <View style={styles.inlineRow}>
                <Ionicons name="call-outline" size={16} color={COLORS.muted} />
                <Text style={styles.inlineText}>{mockUser.telefone}</Text>
              </View>

              <Text style={[styles.muted, { marginTop: 8 }]}>
                Instrumentos de interesse:
              </Text>

              <View style={styles.chipsWrap}>
                {mockUser.interesses.map((t) => (
                  <View key={t} style={styles.chip}>
                    <Text style={styles.chipText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Métricas */}
        <View style={styles.statsRow}>
          {mockUser.stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Segmented */}
        <View style={styles.segment}>
          <Pressable
            style={[styles.segmentItem, tab === "anuncios" && styles.segmentActive]}
            onPress={() => setTab("anuncios")}
          >
            <Text
              style={[styles.segmentText, tab === "anuncios" && styles.segmentTextActive]}
            >
              Anúncios
            </Text>
          </Pressable>
          <Pressable
            style={[styles.segmentItem, tab === "avaliacoes" && styles.segmentActive]}
            onPress={() => setTab("avaliacoes")}
          >
            <Text
              style={[styles.segmentText, tab === "avaliacoes" && styles.segmentTextActive]}
            >
              Avaliações
            </Text>
          </Pressable>
        </View>

        {tab === "anuncios" ? (
          <FlatList
            data={mockAds}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 14 }}
            renderItem={({ item }) => (
              <View style={styles.adCard}>
                <Text style={styles.adTitle}>{item.titulo}</Text>
                <Text style={styles.adPrice}>{item.preco}</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={[styles.badge, { backgroundColor: "#EEF3FF" }]}>
                    <Text style={styles.badgeText}>{item.condicao}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: COLORS.yellow }]}>
                    <Text style={styles.badgeText}>{item.tipo}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <>
            {/* Título e botão Avaliar */}
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Avaliações recebidas</Text>
              <TouchableOpacity style={styles.reviewBtn} activeOpacity={0.85}>
                <Text style={styles.reviewBtnText}>Avaliar</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de avaliações */}
            <FlatList
              data={mockReviews}
              keyExtractor={(i) => i.id}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 10, paddingHorizontal: 14 }}
              renderItem={({ item }) => <ReviewCard item={item} />}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

/** --- Componentes auxiliares --- */

function ReviewCard({ item }) {
  return (
    <View style={styles.reviewCard}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.reviewAvatarText}>{item.iniciais}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={styles.reviewName}>{item.autor}</Text>
            <Ionicons name="star" size={14} color="#F2B705" />
            <Text style={styles.reviewMeta}>{item.estrelas}</Text>
            <Text style={styles.dotSmall}>•</Text>
            <Text style={styles.reviewMeta}>{item.data}</Text>
          </View>
          <Text style={styles.reviewText}>{item.texto}</Text>

          <View style={styles.reviewActions}>
            <Pressable style={styles.actionPill}>
              <Ionicons name="thumbs-up-outline" size={16} color={COLORS.muted} />
              <Text style={styles.actionText}>Útil</Text>
            </Pressable>
            <Pressable style={styles.actionPill}>
              <Ionicons name="thumbs-down-outline" size={16} color={COLORS.muted} />
              <Text style={styles.actionText}>Não útil</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

/** --- Estilos --- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },

  userCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 14,
    marginTop: 6,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: COLORS.chip,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.muted, fontWeight: "700" },
  userName: { color: COLORS.text, fontSize: 16, fontWeight: "700" },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: { color: COLORS.brand, fontWeight: "600" },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  inlineRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 5 },
  inlineText: { color: COLORS.text },
  muted: { color: COLORS.muted },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.stroke,
    marginHorizontal: 4,
  },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  chip: {
    backgroundColor: COLORS.chip,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  chipText: { color: COLORS.brand, fontWeight: "600" },

  statsRow: { flexDirection: "row", gap: 10, marginHorizontal: 14, marginTop: 10 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    alignItems: "center",
    gap: 2,
  },
  statValue: { color: COLORS.text, fontSize: 18, fontWeight: "700" },
  statLabel: { color: COLORS.muted, fontSize: 12 },

  segment: {
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    padding: 6,
    flexDirection: "row",
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentActive: { backgroundColor: COLORS.chip },
  segmentText: { color: COLORS.muted, fontWeight: "600" },
  segmentTextActive: { color: COLORS.brand },

  adCard: {
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  adTitle: { color: COLORS.brand, fontWeight: "700" },
  adPrice: { color: COLORS.brand, marginBottom: 4 },

  reviewsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginTop: 8,
    marginBottom: 6,
  },
  sectionTitle: { color: COLORS.brand, fontWeight: "700" },
  reviewBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewBtnText: { color: COLORS.brand, fontWeight: "600" },

  reviewCard: {
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: COLORS.chip,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { color: COLORS.muted, fontWeight: "700" },
  reviewName: { color: COLORS.brand, fontWeight: "700" },
  reviewMeta: { color: COLORS.muted },
  dotSmall: { color: COLORS.muted, marginHorizontal: 2 },
  reviewText: { color: COLORS.brand, marginTop: 6 },

  reviewActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  actionText: { color: COLORS.muted, fontWeight: "600" },
});