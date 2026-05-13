// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { NavigationContainer } from '@react-navigation/native';
 
const Stack = createNativeStackNavigator<RootStackParamList>();
 
export const RootNavigator: React.FC = () => {
  const { theme } = useA11y();
 
  return (
    <NavigationContainer
      theme={{
        dark: theme.mode === 'dark' || theme.mode === 'highContrast',
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: theme.border,
          notification: theme.danger,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
