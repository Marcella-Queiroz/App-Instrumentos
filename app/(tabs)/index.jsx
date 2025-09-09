import React from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, View } from 'react-native';
import { Text } from '../../components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Dados mocados
const nearbyItems = [
  { id: 1, title: 'Guitarra Fender Stratocaster', price: 'R$ 3.500', condition: 'Seminovo', type: 'Venda', image: 'https://i.imgur.com/H6nL4fI.jpeg' },
  { id: 2, title: 'Violão Yamaha FG830', price: 'R$ 950', condition: 'Usado', type: 'Venda', image: 'https://i.imgur.com/U41m7Hk.jpeg' },
];
const recentItems = [
  { id: 3, title: 'Guitarra Fender Stratocaster', price: 'R$ 3.500', condition: 'Seminovo', type: 'Venda', image: 'https://i.imgur.com/H6nL4fI.jpeg' },
  { id: 4, title: 'Piano Digital Yamaha P-125', price: 'R$ 2.800', condition: 'Usado', type: 'Venda ou Troca', image: 'https://i.imgur.com/sO32J4j.jpeg' },
  { id: 5, title: 'Bateria Pearl Export Series', price: 'R$ 4.200', condition: 'Seminovo', type: 'Troca', image: 'https://i.imgur.com/q8yP8yF.jpeg' },
];
const categories = [
  { name: 'Guitarra', ads: '54 anúncios', icon: 'music', color: '#ef4444' },
  { name: 'Piano', ads: '25 anúncios', icon: 'keyboard-o', color: '#8b5cf6' },
  { name: 'Bateria', ads: '49 anúncios', icon: 'circle-o-notch', color: '#f97316' },
];

// Componente para o card de instrumento
const InstrumentCard = ({ item }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPrice}>{item.price}</Text>
      <View style={styles.cardTags}>
        <View style={[styles.tag, item.condition === 'Usado' ? styles.tagUsed : styles.tagNew]}>
          <Text style={[styles.tagText, item.condition === 'Usado' ? styles.tagTextUsed : styles.tagTextNew]}>{item.condition}</Text>
        </View>
        <Text style={styles.cardType}>• {item.type}</Text>
      </View>
    </View>
  </View>
);

export default function HomeScreen() {
  return (
    <View style={{flex: 1}}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#4f46e5', '#7c3aed']} style={styles.welcomeBanner}>
        <Text style={styles.welcomeTitle}>Olá, João! 👋</Text>
        <Text style={styles.welcomeSubtitle}>Encontre o instrumento perfeito ou venda o que não usa mais</Text>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explorar instrumentos</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.section}>
        <FontAwesome name="map-marker" size={16} color="#34d399" />
        <Text style={styles.sectionTitle}>Próximo a você</Text>
      </View>
      {nearbyItems.map(item => <InstrumentCard key={item.id} item={item} />)}

      <View style={styles.section}>
        <FontAwesome name="line-chart" size={16} color="#f97316" />
        <Text style={styles.sectionTitle}>Categorias em alta</Text>
      </View>
      <View style={styles.categoriesContainer}>
        {categories.map(cat => (
          <View key={cat.name} style={styles.categoryCard}>
            <FontAwesome name={cat.icon} size={24} color={cat.color} />
            <Text style={styles.categoryName}>{cat.name}</Text>
            <Text style={styles.categoryAds}>{cat.ads}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <FontAwesome name="clock-o" size={16} color="#3b82f6" />
        <Text style={styles.sectionTitle}>Adicionados recentemente</Text>
      </View>
      {recentItems.map(item => <InstrumentCard key={item.id} item={item} />)}

      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllButtonText}>Ver todos os anúncios</Text>
      </TouchableOpacity>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Estatísticas da plataforma</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}><Text style={styles.statValue}>4</Text><Text style={styles.statLabel}>Instrumentos</Text></View>
          <View style={styles.statItem}><Text style={styles.statValue}>1.2k+</Text><Text style={styles.statLabel}>Usuários</Text></View>
          <View style={styles.statItem}><Text style={styles.statValue}>850+</Text><Text style={styles.statLabel}>Vendas</Text></View>
        </View>
      </View>

      <View style={styles.safetyTip}>
        <FontAwesome name="lightbulb-o" size={20} color="#f59e0b" />
        <View style={{ marginLeft: 10, flex: 1, backgroundColor: 'transparent' }}>
          <Text style={styles.safetyTitle}>Dica de segurança</Text>
          <Text style={styles.safetyText}>Sempre teste o instrumento pessoalmente antes de finalizar a compra. Prefira locais públicos para encontros.</Text>
        </View>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingHorizontal: 16 },
  welcomeBanner: { borderRadius: 12, padding: 20, marginTop: 16, marginBottom: 24 },
  welcomeTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  welcomeSubtitle: { color: '#e0e7ff', fontSize: 14, marginTop: 4 },
  exploreButton: { backgroundColor: '#fff', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, marginTop: 16, alignSelf: 'flex-start' },
  exploreButtonText: { color: '#4f46e5', fontWeight: 'bold', fontSize: 14 },
  section: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 8, color: '#374151' },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, flexDirection: 'row', padding: 10, shadowColor: '#9ca3af', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  cardImage: { width: 80, height: 80, borderRadius: 8 },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: 'center', backgroundColor: 'transparent' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginVertical: 4 },
  cardTags: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
  tag: { borderRadius: 12, paddingVertical: 3, paddingHorizontal: 10, marginRight: 8 },
  tagNew: { backgroundColor: '#e0e7ff' },
  tagUsed: { backgroundColor: '#fef9c3' },
  tagText: { fontSize: 11, fontWeight: 'bold' },
  tagTextNew: { color: '#4338ca' },
  tagTextUsed: { color: '#713f12' },
  cardType: { fontSize: 12, color: '#6b7280' },
  categoriesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  categoryCard: { borderRadius: 12, padding: 16, alignItems: 'center', width: '31%', shadowColor: '#9ca3af', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  categoryName: { marginTop: 8, fontSize: 13, fontWeight: '600', color: '#374151' },
  categoryAds: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  viewAllButton: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 12, alignItems: 'center', marginBottom: 16 },
  viewAllButtonText: { fontWeight: '600', color: '#374151' },
  statsCard: { borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#9ca3af', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  statsTitle: { textAlign: 'center', fontWeight: '600', color: '#4b5563', marginBottom: 16 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'transparent' },
  statItem: { alignItems: 'center', backgroundColor: 'transparent' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  safetyTip: { borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 32, borderWidth: 1, borderColor: '#fde68a' },
  safetyTitle: { fontWeight: 'bold', color: '#b45309' },
  safetyText: { fontSize: 13, color: '#92400e', marginTop: 4, lineHeight: 18 },
});

