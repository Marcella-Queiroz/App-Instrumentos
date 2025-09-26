// app/(tabs)/sair.jsx
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function Sair() {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    (async () => {
      await signOut();
      router.replace("/login");
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
