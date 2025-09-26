// app/(tabs)/anunciar.jsx
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, Button, Image, ScrollView, Alert,
  Pressable, ActivityIndicator, KeyboardAvoidingView, Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { api, loadToken } from "../../lib/api";

// Normaliza a condição p/ o enum do back: novo | semi-novo | usado
function normalizeCondition(input) {
  const c = String(input || "").trim().toLowerCase();
  if (c.includes("semi")) return "semi-novo";
  if (c.includes("usad")) return "usado";
  if (c.includes("nov")) return "novo";
  return "usado"; // fallback seguro
}

// === logger de erros p/ terminal ===
function logErr(tag, err) {
  try {
    console.log(`\n======= ${tag} ERROR =======`);
    console.log("message:", err?.message);

    if (err?.isAxiosError) {
      const { config, request, response } = err;
      console.log("isAxiosError:", true);
      if (config) {
        const fullUrl = config?.baseURL ? `${config.baseURL}${config.url}` : config?.url;
        console.log("config.method:", config?.method);
        console.log("config.url:", fullUrl);
        console.log("config.headers:", config?.headers);
        console.log("config.data:", config?.data);
      }
      if (response) {
        console.log("response.status:", response?.status);
        console.log("response.headers:", response?.headers);
        console.log("response.data:", response?.data);
      } else if (request) {
        console.log("response: <sem resposta> (houve request)");
      } else {
        console.log("request/response ausentes");
      }
    } else {
      if (err?.status) console.log("status:", err.status);
      if (err?.body) console.log("body:", err.body);
      console.log("stack:", err?.stack);
    }
  } catch (inner) {
    console.log("Falha ao logar erro:", inner?.message);
  } finally {
    console.log("======= end error log =======\n");
  }
}

// Converte "1.234,56" / "1200,00" / "1200" para Number
function parseBRLToNumber(input) {
  if (typeof input === "number") return input;
  if (!input) return NaN;
  const s = String(input).trim();

  if (/,/.test(s)) {
    const clean = s.replace(/\./g, "").replace(",", ".");
    const n = Number(clean);
    return isNaN(n) ? NaN : n;
  }
  const clean = s.replace(/[^\d.]/g, "");
  const n = Number(clean);
  return isNaN(n) ? NaN : n;
}

export default function Anunciar() {
  // Debug de rede/token (remova depois)
  useEffect(() => {
    console.log("API baseURL =>", api.defaults.baseURL);
    api.get("/saude")
      .then(r => console.log("SAUDE OK:", r.data))
      .catch(e => console.log("SAUDE ERR:", e.message));

    loadToken().then(t => {
      console.log("TOKEN PRESENTE?", !!t, t ? `len=${t.length}` : "");
    });
  }, []);

  // formulário
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Guitarra");
  const [condition, setCondition] = useState("Usado");
  const [city, setCity] = useState("");

  // imagens locais selecionadas
  const [assets, setAssets] = useState([]); // [{ uri, width, height, ... }]
  const [loading, setLoading] = useState(false);

  async function ensureMediaPermission() {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (lib.status !== "granted") {
      Alert.alert("Permissão necessária", "Conceda acesso às fotos para selecionar imagens.");
      return false;
    }
    return true;
  }

  async function pickFromLibrary() {
    const ok = await ensureMediaPermission();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setAssets((prev) => [...prev, ...result.assets]);
    }
  }

  async function pickFromCamera() {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (cam.status !== "granted") {
      Alert.alert("Permissão necessária", "Conceda acesso à câmera para tirar a foto.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setAssets((prev) => [...prev, ...result.assets]);
    }
  }

  function removeAsset(index) {
    setAssets((prev) => prev.filter((_, i) => i !== index));
  }

  // --- Upload com AXIOS + FormData (principal) ---
  async function uploadImageAxios(uri) {
    const normalized = Platform.OS === "ios" && uri.startsWith("file://")
      ? uri.replace("file://", "")
      : uri;

    const name = (normalized.split("/").pop() || `photo_${Date.now()}.jpg`).toLowerCase();
    const type = name.endsWith(".png") ? "image/png" : "image/jpeg";

    const form = new FormData();
    form.append("file", { uri: normalized, name, type });

    const { data } = await api.post("/upload", form);
    console.log("UPLOAD RESP (axios):", data);
    return data.url; // caminho relativo: "/uploads/xxx.jpg"
  }

  // --- Fallback com fetch (se o Axios der "Network Error") ---
  async function uploadImageFetch(uri) {
    const normalized = Platform.OS === "ios" && uri.startsWith("file://")
      ? uri.replace("file://", "")
      : uri;

    const name = (normalized.split("/").pop() || `photo_${Date.now()}.jpg`).toLowerCase();
    const type = name.endsWith(".png") ? "image/png" : "image/jpeg";

    const form = new FormData();
    form.append("file", { uri: normalized, name, type });

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload HTTP ${res.status}: ${text}`);
    }
    const data = await res.json();
    console.log("UPLOAD RESP (fetch):", data);
    return data.url; // caminho relativo
  }

  // Criar anúncio
  async function handleCreate() {
    const priceNumber = parseBRLToNumber(price);
    if (!title.trim() || isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert("Campos obrigatórios", "Informe título e um preço válido (ex.: 1200 ou 1.200,00).");
      return;
    }
    if (!city.trim()) {
      Alert.alert("Campos obrigatórios", "Informe a cidade.");
      return;
    }
    if (assets.length === 0) {
      Alert.alert("Imagens", "Adicione ao menos uma foto.");
      return;
    }

    setLoading(true);
    try {
      // 1) Upload das imagens (Axios com fallback em fetch)
      const uploadedUrls = [];
      for (const [idx, a] of assets.entries()) {
        console.log(`>> Subindo imagem ${idx + 1}/${assets.length}:`, a.uri);
        let url;
        try {
          url = await uploadImageAxios(a.uri);
        } catch (err) {
          logErr("UPLOAD (axios)", err);
          url = await uploadImageFetch(a.uri);
        }
        console.log(`<< Upload OK: ${url}`);
        uploadedUrls.push(url);
      }

      // 2) Token obrigatório
      const token = await loadToken();
      if (!token) {
        Alert.alert("Sessão", "Faça login para publicar seu anúncio.");
        return;
      }

      // 3) Converter fotos para URL absoluta (Joi exige URI válida)
      const base = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
      const photosAbsolute = uploadedUrls.map((p) =>
        p.startsWith("http") ? p : `${base}${p}`
      );

      // 4) Montar payload padronizado
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: priceNumber,                              // número validado
        category: category.trim().toLowerCase(),
        condition: normalizeCondition(condition),        // enum suportado
        city: city.trim(),
        photos: photosAbsolute,                          // URIs absolutas
      };

      console.log("PAYLOAD /listings =>", JSON.stringify(payload, null, 2));

      // 5) Enviar
      await api.post("/listings", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Sucesso", "Anúncio criado!");
      setTitle(""); setPrice(""); setDescription(""); setCity("");
      setAssets([]);
    } catch (e) {
      logErr("CREATE LISTING", e);
      const serverMsg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        (Array.isArray(e?.response?.data?.details)
          ? e.response.data.details.map(d => d.message).join("\n")
          : null);
      Alert.alert("Erro", serverMsg || e?.message || "Falha ao criar anúncio.");
    } finally {
      setLoading(false);
    }
  }

  // ======= JSX do componente (fora da handleCreate) =======
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>Criar anúncio</Text>

        <Text style={{ fontWeight: "600" }}>Título</Text>
        <TextInput
          placeholder="Ex.: Guitarra Stratocaster"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
        />

        <Text style={{ fontWeight: "600" }}>Preço (R$)</Text>
        <TextInput
          placeholder="Ex.: 1.200,00"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
        />

        <Text style={{ fontWeight: "600" }}>Descrição</Text>
        <TextInput
          placeholder="Fale sobre o instrumento"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 10,
            textAlignVertical: "top",
          }}
        />

        <Text style={{ fontWeight: "600" }}>Categoria</Text>
        <TextInput
          placeholder="Ex.: Guitarra, Violão, Teclado…"
          value={category}
          onChangeText={setCategory}
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
        />

        <Text style={{ fontWeight: "600" }}>Condição</Text>
        <TextInput
          placeholder="Novo / Usado / Semi-novo"
          value={condition}
          onChangeText={setCondition}
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
        />

        <Text style={{ fontWeight: "600" }}>Cidade</Text>
        <TextInput
          placeholder="Ex.: Maringá - PR"
          value={city}
          onChangeText={setCity}
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
        />

        <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
          <Button title="📸 Câmera" onPress={pickFromCamera} />
          <Button title="🖼️ Galeria" onPress={pickFromLibrary} />
        </View>

        {assets.length > 0 && (
          <View style={{ marginTop: 12, gap: 8 }}>
            <Text style={{ fontWeight: "600" }}>Pré-visualização ({assets.length})</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {assets.map((a, i) => (
                <Pressable key={i} onLongPress={() => removeAsset(i)}>
                  <Image source={{ uri: a.uri }} style={{ width: 100, height: 100, borderRadius: 8 }} />
                  <Text style={{ fontSize: 12, color: "#888", textAlign: "center" }}>segure p/ remover</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={{ marginTop: 16 }}>
          {loading ? (
            <View style={{ paddingVertical: 12 }}>
              <ActivityIndicator size="large" />
              <Text style={{ textAlign: "center", marginTop: 8 }}>
                Enviando imagens e criando anúncio…
              </Text>
            </View>
          ) : (
            <Button title="📣 Publicar anúncio" onPress={handleCreate} />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
