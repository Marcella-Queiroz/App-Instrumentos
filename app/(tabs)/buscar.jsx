import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Platform, Text, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function BuscarScreen() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'

  // FUTURA IMPLEMENTAÇÃO DE API: filtros e ordenação
  const handleFilterPress = () => {
    alert('Filtro clicado!');
  };

  const handleSortPress = () => {
    alert('Mais recente clicado!');
  };

  // Exemplo de dados do instrumento
  const instrumento = {
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    condition: 'Seminovo',
    type: 'Venda',
    views: 89,
    likes: 12,
  };

  return (
    <View style={styles.screen}>
      {/* Campo de busca no topo */}
      <View style={styles.searchBarWrapper}>
        <Ionicons name="search" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Buscar instrumentos..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#888"
          returnKeyType="search"
        />
      </View>

      {/* Linha de filtros e visualização */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.filterBtn} onPress={handleFilterPress} activeOpacity={0.7}>
          <Ionicons name="filter" size={18} color="#222" style={{ marginRight: 6 }} />
          <Text style={styles.filterText}>Filtros</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortBtn} onPress={handleSortPress} activeOpacity={0.7}>
          <MaterialCommunityIcons name="sort-calendar-descending" size={18} color="#222" style={{ marginRight: 6 }} />
          <Text style={styles.sortText}>Mais recente</Text>
        </TouchableOpacity>
        <View style={styles.viewBtns}>
          <TouchableOpacity
            style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? '#fff' : '#222'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons name="grid" size={20} color={viewMode === 'grid' ? '#fff' : '#222'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card do instrumento */}
      <View style={styles.card}>
        <Image source={{ uri: instrumento.image }} style={styles.cardImage} resizeMode="cover" />
        {/* Tags */}
        <View style={styles.tagsRow}>
          <Text style={styles.tagBlue}>{instrumento.condition}</Text>
          <Text style={styles.tagGray}>{instrumento.type}</Text>
        </View>
        {/* Botão de favorito */}
        <TouchableOpacity style={styles.flagBtn}>
          <Ionicons name="flag-outline" size={22} color="#222" />
        </TouchableOpacity>
        {/* Visualizações e curtidas */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Ionicons name="eye" size={16} color="#fff" />
            <Text style={styles.infoText}>{instrumento.views}</Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="heart" size={16} color="#fff" />
            <Text style={styles.infoText}>{instrumento.likes}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 56 : 32,
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 36,
    marginRight: 8,
  },
  filterText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 36,
    marginRight: 8,
  },
  sortText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  viewBtns: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 6,
  },
  viewBtn: {
    backgroundColor: '#F5F6FA',
    borderRadius: 8,
    padding: 6,
    marginLeft: 2,
  },
  viewBtnActive: {
    backgroundColor: '#0A0D18',
  },
  // Card styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  tagsRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
  },
  tagBlue: {
    backgroundColor: '#E3EBFF',
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
  },
  tagGray: {
    backgroundColor: '#F3F4F6',
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  flagBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    elevation: 2,
  },
  infoRow: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    gap: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2226',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  infoText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: 'bold',
  },
});