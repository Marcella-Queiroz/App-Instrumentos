// app/(tabs)/listing/[id].jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api } from "../../../lib/api"; // caminho correto para (tabs)/listing/[id].jsx

const { width } = Dimensions.get("window");
const BASE = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
const toAbs = (p) => (typeof p === "string" && p.startsWith("http") ? p : `${BASE}${p || ""}`);

// Helper: tentar transformar qualquer “photos” em array de strings
function coercePhotos(raw) {
  if (Array.isArray(raw)) {
    return raw.filter((x) => typeof x === "string" && x.length);
  }
  if (typeof raw === "string") {
    // pode ser JSON dentro de string
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((x) => typeof x === "string" && x.length);
      }
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.photos)) {
        return parsed.photos.filter((x) => typeof x === "string" && x.length);
      }
    } catch {
      // se for apenas um caminho simples "/uploads/..."
      if (raw.startsWith("/")) return [raw];
    }
  }
  return [];
}

export default function ListingDetail() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ? String(params.id) : "";

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!id) {
        setErr("ID do anúncio não informado.");
        setLoading(false);
        return;
      }

      setErr("");
      setLoading(true);

      try {
        console.log("[DETAIL] fetching /listings/" + id);
        const { data } = await api.get(`/listings/${encodeURIComponent(id)}`);

        // aceita {data:{...}} ou objeto
        const obj = data?.data ?? data ?? {};
        console.log("[DETAIL] raw item:", JSON.stringify(obj, null, 2));

        // garante tipos renderizáveis
        const safe = {
          id: obj.id ?? id,
          title: `${obj.title ?? ""}`,
          description: `${obj.description ?? ""}`,
          price: Number(obj.price ?? 0),
          category: `${obj.category ?? ""}`,
          condition: `${obj.condition ?? ""}`,
          city: `${obj.city ?? ""}`,
          photos: coercePhotos(obj.photos),
        };

        console.log("[DETAIL] coerced item:", JSON.stringify(safe, null, 2));

        if (mounted) setItem(safe);
      } catch (e) {
        console.log("[DETAIL] ERR:", {
          message: e?.message,
          status: e?.response?.status,
          data: e?.response?.data,
        });
        if (mounted) {
          setErr(
            e?.response?.data?.message ||
              e?.response?.data?.error ||
              e?.message ||
              "Falha ao carregar anúncio."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Carregando…</Text>
      </View>
    );
  }

  if (err || !item) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
        <Text style={{ color: "tomato", textAlign: "center" }}>
          {err || "Anúncio não encontrado."}
        </Text>
      </View>
    );
  }

  const photos = item.photos;
  const priceText = isFinite(item.price) ? item.price.toLocaleString("pt-BR") : "—";

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Galeria simples */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {photos.length ? (
          photos.map((p, i) => (
            <Image
              key={String(i)}
              source={{ uri: toAbs(p) }}
              style={{ width, height: width * 0.75, backgroundColor: "#eee" }}
            />
          ))
        ) : (
          <View
            style={{
              width,
              height: width * 0.75,
              backgroundColor: "#eee",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#888" }}>Sem fotos</Text>
          </View>
        )}
      </ScrollView>

      <View style={{ padding: 16, gap: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "800" }}>{item.title || "—"}</Text>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          R$ {priceText}
        </Text>
        <Text style={{ color: "#666" }}>
          {(item.category || "—")} • {(item.condition || "—")} • {(item.city || "—")}
        </Text>

        {item.description ? (
          <>
            <Text style={{ marginTop: 12, fontWeight: "700" }}>Descrição</Text>
            <Text style={{ lineHeight: 20 }}>{item.description}</Text>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}
