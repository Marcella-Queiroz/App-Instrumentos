import React from 'react';
import { Pressable, View, Text, StyleSheet, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

function TabBarIcon(props) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

// Componente do Cabeçalho Personalizado
function CustomHeader() {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Image
          source={require('../../assets/images/LogominiTunetrade.png')}
          style={styles.logoImage}
        />
        <Text style={styles.headerTitle}>TuneTrade</Text>
      </View>
      <View style={styles.headerRight}>
        <View className="userInitial" style={styles.userInitial}>
          <Text style={styles.userInitialText}>JS</Text>
        </View>
        <FontAwesome name="star" size={16} color="#facc15" />
        <Text style={styles.ratingText}>4.8</Text>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        header: () => <CustomHeader />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => <TabBarIcon name="home" color={focused ? '#000' : '#999'} />,
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ focused }) => <TabBarIcon name="search" color={focused ? '#000' : '#999'} />,
        }}
      />
      <Tabs.Screen
        name="anunciar"
        options={{
          title: 'Anunciar',
          tabBarIcon: ({ focused }) => <TabBarIcon name="plus-circle" color={focused ? '#000' : '#999'} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabBarIcon name="user" color={focused ? '#000' : '#999'} />,
        }}
      />
      <Tabs.Screen
        name="sair"
        options={{
          title: 'Sair',
          tabBarIcon: ({ focused }) => <TabBarIcon name="sign-out" color={focused ? '#000' : '#999'} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40, // Ajuste para status bar
    paddingBottom: 12,
    backgroundColor: '#f8f9fa',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInitial: {
    backgroundColor: '#e0e0e0',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userInitialText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '500',
  },
});
