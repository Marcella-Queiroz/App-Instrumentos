import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";

export default function Anunciar() {
  const [categoria, setCategoria] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [fotos, setFotos] = useState([]); // Estado para as fotos

  // Função para abrir a galeria e selecionar fotos
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 1,
    });

    if (!result.canceled) {
      setFotos(result.assets);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.title}>Anunciar instrumento</Text>

        <Text style={styles.label}>Fotos do instrumento</Text>
        <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
          <FontAwesome name="camera" size={24} color="#222" />
          <Text style={styles.photoText}>Adicionar fotos</Text>
        </TouchableOpacity>
        <Text style={styles.photoLimit}>
          Máximo 4 fotos. A primeira será a foto principal.
        </Text>

        {/* Exibe as fotos selecionadas */}
        {fotos.length > 0 && (
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            {fotos.map((foto, idx) => (
              <View key={idx} style={{ marginRight: 8 }}>
                <Image
                  source={{ uri: foto.uri }}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
              </View>
            ))}
          </View>
        )}

        <Text style={styles.label}>Título do anúncio*</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Guitarra Fender Stratocaster"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Descrição*</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Descreva o instrumento, estado de conservação, acessórios inclusos..."
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <Text style={styles.label}>Categoria*</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={categoria}
            style={styles.picker}
            onValueChange={(itemValue) => setCategoria(itemValue)}
          >
            <Picker.Item label="Selecione a categoria" value="" />
            <Picker.Item label="Guitarra" value="guitarra" />
            <Picker.Item label="Baixo" value="baixo" />
            <Picker.Item label="Teclado" value="teclado" />
          </Picker>
        </View>

        <Text style={styles.label}>Estado do instrumento*</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={estado}
            style={styles.picker}
            onValueChange={(itemValue) => setEstado(itemValue)}
          >
            <Picker.Item label="Selecione o estado" value="" />
            <Picker.Item label="Novo" value="novo" />
            <Picker.Item label="Usado" value="usado" />
          </Picker>
        </View>

        <Text style={styles.label}>Tipo de negociação*</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={tipo}
            style={styles.picker}
            onValueChange={(itemValue) => setTipo(itemValue)}
          >
            <Picker.Item label="Selecione o tipo" value="" />
            <Picker.Item label="Venda" value="venda" />
            <Picker.Item label="Troca" value="troca" />
            <Picker.Item label="Doação" value="doacao" />
          </Picker>
        </View>

        <Text style={styles.label}>Preço (R$)*</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          value={preco}
          onChangeText={setPreco}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Publicar anúncio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  formBox: {
    backgroundColor: "#fafafd",
    borderRadius: 18,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: "500",
  },
  photoBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    borderStyle: "dashed",
    padding: 15,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  photoText: {
    marginTop: 10,
    color: "#222",
    fontWeight: "bold",
    textAlign: "center",
  },
  photoLimit: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f5f5f7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
  },
  pickerWrapper: {
    backgroundColor: "#f5f5f7",
    borderRadius: 8,
    marginBottom: 5,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#0a0a14",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});