// src/navigation/TabNavigator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useA11y } from '../accessibility/AccessibilityContext';
import { TabParamList } from './types';
import { borderRadius, spacing } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import TalkBackScreen from '../screens/TalkBackScreen';
import ContrastScreen from '../screens/ContrastScreen';
import FontSizeScreen from '../screens/FontSizeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
  color: string;
}

const TabIcon: React.FC<TabIconProps> = ({ emoji, label, focused, color }) => {
  const { scaledFont, theme } = useA11y();
  return (
    <View
      style={[
        tabStyles.iconContainer,
        focused && { backgroundColor: theme.primary + '20' },
      ]}
    >
      <Text
        style={{ fontSize: scaledFont(22) }}
        accessible={false}
        importantForAccessibility="no"
      >
        {emoji}
      </Text>
      <Text
        style={[
          tabStyles.label,
          {
            color,
            fontSize: scaledFont(10),
            fontFamily: focused ? 'SpaceGrotesk_700Bold' : 'SpaceGrotesk_400Regular',
          },
        ]}
        accessible={false}
        importantForAccessibility="no"
      >
        {label}
      </Text>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing[1],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.md,
    minWidth: 56,
    minHeight: 44,
  },
  label: {
    marginTop: 2,
    letterSpacing: 0.3,
  },
});

export const TabNavigator: React.FC = () => {
  const { theme, themeMode } = useA11y();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: themeMode === 'highContrast' ? theme.border : theme.border,
          borderTopWidth: themeMode === 'highContrast' ? 2 : 1,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarAccessibilityLabel: 'Inicio, pestaña 1 de 5',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="🏠" label="Inicio" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TalkBack"
        component={TalkBackScreen}
        options={{
          tabBarAccessibilityLabel: 'TalkBack demo, pestaña 2 de 5',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="🔊" label="TalkBack" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contrast"
        component={ContrastScreen}
        options={{
          tabBarAccessibilityLabel: 'Contraste, pestaña 3 de 5',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="🎨" label="Contraste" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FontSize"
        component={FontSizeScreen}
        options={{
          tabBarAccessibilityLabel: 'Tamaño de fuente, pestaña 4 de 5',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="🔤" label="Fuente" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarAccessibilityLabel: 'Configuración, pestaña 5 de 5',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon emoji="⚙️" label="Config" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;