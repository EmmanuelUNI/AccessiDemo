// src/screens/TalkBackScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
  AccessibilityInfo,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useA11y } from '../accessibility/AccessibilityContext';
import { borderRadius, spacing } from '../theme';

// ─── Live announcement preview ────────────────────────────────────────────────

interface AnnouncementPreviewProps {
  text: string;
  visible: boolean;
}

const AnnouncementPreview: React.FC<AnnouncementPreviewProps> = ({ text, visible }) => {
  const { theme, scaledFont } = useA11y();
  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(2500),
        Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, text]);

  return (
    <Animated.View
      style={[
        previewStyles.container,
        {
          backgroundColor: '#1a1a1a',
          borderColor: '#FFFF00',
          opacity: anim,
          transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
        },
      ]}
      accessible={false}
      importantForAccessibility="no"
    >
      <Text style={{ fontSize: scaledFont(11), color: '#FFFF00', fontFamily: 'SpaceGrotesk_700Bold', letterSpacing: 0.5 }}>
        🔊 TALKBACK ANUNCIARÍA:
      </Text>
      <Text style={{ fontSize: scaledFont(16), color: '#FFFFFF', marginTop: spacing[1], fontFamily: 'SpaceGrotesk_500Medium', lineHeight: 24 }}>
        "{text}"
      </Text>
    </Animated.View>
  );
};

const previewStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: spacing[4],
    right: spacing[4],
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    zIndex: 100,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
});

// ─── Demo item ────────────────────────────────────────────────────────────────

interface DemoItemProps {
  title: string;
  description: string;
  badLabel: string;
  goodLabel: string;
  badA11yLabel?: string;
  goodA11yLabel: string;
  goodHint?: string;
  onGoodPress: (announcement: string) => void;
}

const DemoItem: React.FC<DemoItemProps> = ({
  title,
  description,
  badLabel,
  goodLabel,
  badA11yLabel,
  goodA11yLabel,
  goodHint,
  onGoodPress,
}) => {
  const { theme, scaledFont } = useA11y();

  return (
    <View
      style={[
        demoStyles.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      {/* Title */}
      <Text
        style={[demoStyles.title, { color: theme.text, fontSize: scaledFont(16) }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      <Text style={[demoStyles.desc, { color: theme.textSecondary, fontSize: scaledFont(13) }]}>
        {description}
      </Text>

      {/* Comparison */}
      <View style={demoStyles.compareRow}>
        {/* ❌ Bad example */}
        <View style={demoStyles.compareColumn}>
          <View style={[demoStyles.badge, { backgroundColor: '#FEE2E2' }]}>
            <Text style={{ fontSize: scaledFont(10), color: '#DC2626', fontFamily: 'SpaceGrotesk_700Bold' }}>
              ❌ MAL
            </Text>
          </View>
          <TouchableOpacity
            style={[demoStyles.exampleButton, { backgroundColor: theme.surfaceElevated ?? theme.surface, borderColor: '#F87171' }]}
            accessible={true}
            accessibilityLabel={badA11yLabel ?? badLabel}
            accessibilityRole="button"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onGoodPress(badA11yLabel ?? badLabel);
            }}
          >
            <Text style={[demoStyles.exampleText, { color: theme.text, fontSize: scaledFont(14) }]}>
              {badLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Good example */}
        <View style={demoStyles.compareColumn}>
          <View style={[demoStyles.badge, { backgroundColor: '#D1FAE5' }]}>
            <Text style={{ fontSize: scaledFont(10), color: '#059669', fontFamily: 'SpaceGrotesk_700Bold' }}>
              ✅ BIEN
            </Text>
          </View>
          <TouchableOpacity
            style={[demoStyles.exampleButton, { backgroundColor: theme.surfaceElevated ?? theme.surface, borderColor: '#34D399' }]}
            accessible={true}
            accessibilityLabel={goodA11yLabel}
            accessibilityHint={goodHint}
            accessibilityRole="button"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onGoodPress(goodA11yLabel + (goodHint ? '. ' + goodHint : ''));
            }}
          >
            <Text style={[demoStyles.exampleText, { color: theme.text, fontSize: scaledFont(14) }]}>
              {goodLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const demoStyles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: spacing[1],
  },
  desc: {
    fontFamily: 'SpaceGrotesk_400Regular',
    lineHeight: 20,
    marginBottom: spacing[3],
  },
  compareRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  compareColumn: {
    flex: 1,
    gap: spacing[2],
  },
  badge: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  exampleButton: {
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    padding: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  exampleText: {
    fontFamily: 'SpaceGrotesk_500Medium',
    textAlign: 'center',
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

const TalkBackScreen: React.FC = () => {
  const { theme, scaledFont, screenReaderActive, announce } = useA11y();
  const insets = useSafeAreaInsets();
  const [announcement, setAnnouncement] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const triggerAnnouncement = (text: string) => {
    setAnnouncement(text);
    setShowPreview(true);
    setPreviewKey((k) => k + 1);
    announce(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleAnnounceTip = () => {
    const tips = [
      'Anuncio de prueba: Esta pantalla demuestra cómo funciona el lector de pantalla',
      'Los botones tienen etiquetas descriptivas para personas con discapacidad visual',
      'Cada elemento interactivo tiene un accessibilityLabel definido',
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    triggerAnnouncement(tip);
  };

  const DEMOS = [
    {
      title: '1. Etiquetas descriptivas',
      description:
        'accessibilityLabel debe describir QUÉ hace el elemento, no solo lo que se ve.',
      badLabel: '🖼️',
      badA11yLabel: 'imagen',
      goodLabel: '🖼️',
      goodA11yLabel: 'Foto de perfil de María González, ingeniera de software',
      goodHint: 'Toca para ver el perfil completo',
    },
    {
      title: '2. Botones informativos',
      description:
        'Los botones deben indicar su acción, no solo decir "botón" o "aquí".',
      badLabel: 'Click aquí',
      badA11yLabel: 'botón',
      goodLabel: 'Descargar reporte',
      goodA11yLabel: 'Descargar reporte mensual en PDF',
      goodHint: 'Descargará un archivo de aproximadamente 2 megabytes',
    },
    {
      title: '3. Estado del elemento',
      description:
        'accessibilityState comunica disabled, selected, checked al lector.',
      badLabel: 'Enviar',
      badA11yLabel: 'Enviar, botón',
      goodLabel: 'Enviar',
      goodA11yLabel: 'Enviar formulario',
      goodHint: 'Formulario completado y listo para enviar',
    },
    {
      title: '4. Agrupar elementos relacionados',
      description:
        'accessible={true} en el contenedor agrupa elementos para que el lector los lea juntos.',
      badLabel: 'Precio: $99',
      badA11yLabel: '99',
      goodLabel: 'Precio: $99',
      goodA11yLabel: 'Precio del producto: noventa y nueve dólares. Incluye IVA',
      goodHint: 'Toca para ver desglose de precio',
    },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#7C3AED', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Demo de TalkBack. Aprende cómo funciona el lector de pantalla"
        >
          <Text style={{ fontSize: scaledFont(48) }}>🔊</Text>
          <Text style={[styles.headerTitle, { fontSize: scaledFont(26) }]}>
            TalkBack Demo
          </Text>
          <Text style={[styles.headerSubtitle, { fontSize: scaledFont(14) }]}>
            Compara implementaciones correctas{'\n'}e incorrectas de accesibilidad
          </Text>

          {/* Screen reader status indicator */}
          <View
            style={[
              styles.statusChip,
              { backgroundColor: screenReaderActive ? '#22C55E' : '#F59E0B' },
            ]}
            accessible={true}
            accessibilityLabel={
              screenReaderActive
                ? 'TalkBack está activo en tu dispositivo'
                : 'TalkBack no está activo. Actívalo en Configuración para la experiencia completa'
            }
          >
            <Text style={[styles.statusText, { fontSize: scaledFont(12) }]}>
              {screenReaderActive ? '✅ TalkBack ACTIVO' : '⚠️ TalkBack INACTIVO'}
            </Text>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing[4], marginTop: spacing[4] }}>
          {/* Quick announce button */}
          <TouchableOpacity
            onPress={handleAnnounceTip}
            style={[
              styles.announceBtn,
              { backgroundColor: theme.primary, borderRadius: borderRadius.lg },
            ]}
            accessible={true}
            accessibilityLabel="Anunciar mensaje de prueba con el lector de pantalla"
            accessibilityHint="Se enviará un anuncio al lector de pantalla de tu dispositivo"
            accessibilityRole="button"
          >
            <Text style={{ fontSize: scaledFont(20) }}>📢</Text>
            <View style={{ flex: 1, marginLeft: spacing[3] }}>
              <Text style={[styles.announceBtnTitle, { fontSize: scaledFont(15) }]}>
                Probar anuncio
              </Text>
              <Text style={[styles.announceBtnDesc, { fontSize: scaledFont(12) }]}>
                Envía texto al lector de pantalla del dispositivo
              </Text>
            </View>
          </TouchableOpacity>

          {/* Custom announce input */}
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Escribe texto para anunciar..."
              placeholderTextColor={theme.textDisabled}
              style={[
                styles.input,
                {
                  color: theme.text,
                  fontSize: scaledFont(14),
                  fontFamily: 'SpaceGrotesk_400Regular',
                },
              ]}
              accessible={true}
              accessibilityLabel="Campo de texto para anunciar. Escribe el mensaje que quieres que TalkBack lea en voz alta"
              accessibilityHint="Después de escribir, toca el botón Anunciar"
              returnKeyType="done"
              onSubmitEditing={() => {
                if (inputValue.trim()) {
                  triggerAnnouncement(inputValue.trim());
                  setInputValue('');
                }
              }}
            />
            <TouchableOpacity
              onPress={() => {
                if (inputValue.trim()) {
                  triggerAnnouncement(inputValue.trim());
                  setInputValue('');
                }
              }}
              style={[styles.inputBtn, { backgroundColor: theme.primary }]}
              accessible={true}
              accessibilityLabel="Anunciar texto ingresado"
              accessibilityRole="button"
              disabled={!inputValue.trim()}
            >
              <Text style={{ fontSize: scaledFont(14), color: '#fff', fontFamily: 'SpaceGrotesk_700Bold' }}>
                📢
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section header */}
          <Text
            style={[styles.sectionLabel, { color: theme.textSecondary, fontSize: scaledFont(11) }]}
            accessibilityRole="header"
          >
            EJEMPLOS COMPARATIVOS
          </Text>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary, fontSize: scaledFont(13) }]}>
            Toca cada botón para ver qué anunciaría TalkBack
          </Text>

          {/* Demo items */}
          {DEMOS.map((demo) => (
            <DemoItem
              key={demo.title}
              {...demo}
              onGoodPress={triggerAnnouncement}
            />
          ))}

          {/* WCAG info */}
          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: theme.primary + '15',
                borderColor: theme.primary + '40',
                borderLeftColor: theme.primary,
              },
            ]}
            accessible={true}
            accessibilityLabel="Criterio WCAG. 1.3.1 Información y relaciones. La información transmitida a través del formato también está disponible en texto"
          >
            <Text style={[styles.infoTitle, { color: theme.primary, fontSize: scaledFont(13) }]}>
              📋 WCAG 2.1 — 1.3.1 Información y relaciones
            </Text>
            <Text style={[styles.infoText, { color: theme.text, fontSize: scaledFont(13) }]}>
              La información transmitida a través del formato también debe estar disponible en texto para lectores de pantalla.
            </Text>
          </View>

          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: theme.accent + '15',
                borderColor: theme.accent + '40',
                borderLeftColor: theme.accent,
                marginTop: spacing[2],
              },
            ]}
            accessible={true}
            accessibilityLabel="Criterio WCAG. 4.1.2 Nombre, función, valor. Todos los componentes de interfaz deben tener nombre y función que se pueda determinar programáticamente"
          >
            <Text style={[styles.infoTitle, { color: theme.accent, fontSize: scaledFont(13) }]}>
              📋 WCAG 2.1 — 4.1.2 Nombre, función, valor
            </Text>
            <Text style={[styles.infoText, { color: theme.text, fontSize: scaledFont(13) }]}>
              Todos los componentes de interfaz deben tener nombre y función que pueda determinarse programáticamente.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating announcement preview */}
      <AnnouncementPreview
        key={previewKey}
        text={announcement}
        visible={showPreview}
      />
    </View>
  );
};

export default TalkBackScreen;

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[5],
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  headerTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: 'SpaceGrotesk_400Regular',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
  },
  statusChip: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    marginTop: spacing[1],
  },
  statusText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  announceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  announceBtnTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#FFFFFF',
  },
  announceBtnDesc: {
    fontFamily: 'SpaceGrotesk_400Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    marginBottom: spacing[4],
    paddingLeft: spacing[3],
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: 52,
  },
  inputBtn: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing[1],
    marginTop: spacing[2],
  },
  sectionDesc: {
    fontFamily: 'SpaceGrotesk_400Regular',
    lineHeight: 20,
    marginBottom: spacing[4],
  },
  infoBox: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  infoTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: spacing[2],
  },
  infoText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    lineHeight: 20,
  },
});