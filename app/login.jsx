import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, ScrollView, Image } from 'react-native';

const instruments = [
  'Guitarra/Violão', 'Baixo', 'Bateria', 'Teclado', 'Piano', 'Violino', 'Flauta', 'Saxofone', 'Trompete', 'Outros'
];

// FUTURA IMPLEMENTAÇÃO DE API:
// const API_URL = 'http://localhost:3001/api/usuario';
// async function handleRegister(form, onLogin, setError) {
//   ...
// }
// async function handleLogin(form, onLogin, setError) {
//   ...
// }
// ...existing code...

export default function LoginScreen({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    whatsapp: '',
    location: '',
    interests: [],
  });
  const router = useRouter();

  const handleCheckbox = (instrument) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(instrument)
        ? prev.interests.filter(i => i !== instrument)
        : [...prev.interests, instrument]
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
              <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/LogoTuneTrade.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Compre, venda e troque instrumentos musicais</Text>
      </View>
        <Text style={styles.welcome}>Bem-vindo</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, tab === 'login' && styles.tabActive]}
            onPress={() => setTab('login')}
          >
            <Text style={tab === 'login' ? styles.tabTextActive : styles.tabText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'register' && styles.tabActive]}
            onPress={() => setTab('register')}
          >
            <Text style={tab === 'register' ? styles.tabTextActive : styles.tabText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
        {tab === 'register' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={form.name}
              onChangeText={name => setForm({ ...form, name })}
            />
            {error.name && <Text style={styles.error}>{error.name}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={email => setForm({ ...form, email })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error.email && <Text style={styles.error}>{error.email}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={form.password}
              onChangeText={password => setForm({ ...form, password })}
              secureTextEntry
            />
            {error.password && <Text style={styles.error}>{error.password}</Text>}
            <TextInput
              style={styles.input}
              placeholder="WhatsApp"
              value={form.whatsapp}
              onChangeText={whatsapp => setForm({ ...form, whatsapp })}
              keyboardType="phone-pad"
            />
            {error.whatsapp && <Text style={styles.error}>{error.whatsapp}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Localização"
              value={form.location}
              onChangeText={location => setForm({ ...form, location })}
            />
            {error.location && <Text style={styles.error}>{error.location}</Text>}
            <Text style={styles.label}>Instrumentos de interesse</Text>
            <View style={styles.checkboxContainer}>
              {instruments.map((inst, idx) => (
                <TouchableOpacity
                  key={inst}
                  style={styles.checkboxRow}
                  onPress={() => handleCheckbox(inst)}
                >
                  <View style={styles.checkbox}>
                    {form.interests.includes(inst) && <View style={styles.checkboxChecked} />}
                  </View>
                  <Text style={styles.checkboxLabel}>{inst}</Text>
                  {(idx + 1) % 2 === 0 && <View style={{ width: 16 }} />}
                </TouchableOpacity>
              ))}
            </View>
            {/* FUTURA IMPLEMENTAÇÃO DE API: handleRegister(form, onLogin) */}
            <TouchableOpacity style={styles.button} onPress={onLogin}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </>
        )}
        {tab === 'login' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={email => setForm({ ...form, email })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={form.password}
              onChangeText={password => setForm({ ...form, password })}
              secureTextEntry
            />
            {/* FUTURA IMPLEMENTAÇÃO DE API: handleLogin(form, onLogin) */}
            <TouchableOpacity style={styles.button} onPress={onLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <Text style={styles.demoText}>
              Demo: use qualquer email dos usuários mock:{"\n"}
              joao@email.com, maria@email.com, pedro@email.com
            </Text>
          </>
        )}
        </View>
      </ScrollView>
      {/* Botão para pular login/cadastro */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={onLogin}
      >
        <Text style={styles.skipButtonText}>Pular</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#eaf0ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 180,
    height: 70,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: 280,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  welcome: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#888',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#222',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 6,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#222',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#222',
  },
  button: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  demoText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  skipButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#888',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 3,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});