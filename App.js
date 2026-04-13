import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Platform, ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👇 AQUÍ ESTÁ LA MAGIA: Importamos tus pantallas separadas 👇
import { LoginScreen, RegisterScreen } from './src/screens/AuthScreens';
import HomeScreen from './src/screens/HomeScreen';

const BACKEND_URL = 'http://localhost:3000'; // Usa tu IP si estás en Android/iOS físico

// 👇 CRUCIAL: Le agregamos "export" para que las pantallas puedan usar el signIn y signOut 👇
export const AuthContext = React.createContext();

// ==========================================
// 🚀 4. ENTRY POINT DE LA APLICACIÓN
// ==========================================
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) setUserToken(token);
      } catch (e) { console.error(e); }
      setIsLoading(false);
    };
    checkToken();
  }, []);

  const authContext = {
    signIn: async (email, password) => {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const textData = await response.text(); 
        let data;
        try { data = JSON.parse(textData); } 
        catch (e) { return { success: false, error: "Servidor falló. Revisa la consola." }; }

        if (response.ok) {
          await AsyncStorage.setItem('userToken', data.token);
          setUserToken(data.token);
          return { success: true };
        } else {
          return { success: false, error: data.error || 'Credenciales incorrectas' };
        }
      } catch (error) {
        return { success: false, error: 'Servidor apagado o IP incorrecta.' };
      }
    },
    signOut: async () => {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    },
  };

  if (isLoading) return <ActivityIndicator size="large" color="#4A3B2C" style={{flex:1, backgroundColor:'#E6D2B5'}} />;

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userToken == null ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

// ==========================================
// 🎨 5. ESTILOS CENTRALIZADOS
// ==========================================
const handwrittenFont = {
  fontFamily: Platform.OS === 'ios' ? 'Noteworthy' : 'casual',
  fontStyle: Platform.OS === 'android' ? 'italic' : 'normal',
};

const styles = StyleSheet.create({
  deskBackground: { flex: 1, backgroundColor: '#E6D2B5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  paperSheet: {
    backgroundColor: '#FDFAF0', width: '100%', borderRadius: 8,
    borderBottomRightRadius: 25, borderTopLeftRadius: 15,
    shadowColor: '#4A3B2C', shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 5, elevation: 8,
    transform: [{ rotate: '-1.5deg' }], overflow: 'hidden',
  },
  paperContent: { padding: 30, zIndex: 2, flex: 1 },
  paperLinesContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, paddingTop: 45 },
  paperHorizontalLine: { height: 30, borderBottomWidth: 1.5, borderBottomColor: '#BBD1E8' },
  notebookMargin: { position: 'absolute', left: 45, top: 0, bottom: 0, width: 2, backgroundColor: '#E89090', zIndex: 1 },
  tape: {
    position: 'absolute', top: -5, alignSelf: 'center', width: 110, height: 35,
    backgroundColor: 'rgba(255, 248, 220, 0.7)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
    transform: [{ rotate: '3deg' }], zIndex: 3,
  },
  handwrittenTitle: { ...handwrittenFont, fontSize: 45, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginBottom: 5, textDecorationLine: 'underline', textDecorationStyle: 'double' },
  subtitleContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  doodleSubtitle: { ...handwrittenFont, fontSize: 20, color: '#444', marginLeft: 8 },
  inputContainer: { marginBottom: 20, paddingLeft: 20 },
  handwrittenLabel: { ...handwrittenFont, fontSize: 18, color: '#333', marginBottom: 5 },
  handwrittenInput: {
    ...handwrittenFont, fontSize: 20, color: '#00008b', paddingVertical: 10, paddingHorizontal: 15,
    borderWidth: 2, borderColor: '#333', borderTopLeftRadius: 15, borderTopRightRadius: 4,
    borderBottomRightRadius: 18, borderBottomLeftRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ rotate: '0.5deg' }]
  },
  hdBtnWrapper: { position: 'relative', paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  hdStroke: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  hdContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  hdBtnText: { ...handwrittenFont, fontSize: 24, fontWeight: 'bold', color: '#222', marginRight: 10 },
  linkText: { ...handwrittenFont, textAlign: 'center', fontSize: 16, color: '#00008b', textDecorationLine: 'underline' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20, alignItems: 'center' },
  headerText: { ...handwrittenFont, fontSize: 30, color: '#333', fontWeight: 'bold', textDecorationLine: 'underline' },
  timeText: { ...handwrittenFont, color: '#666', fontSize: 16, fontWeight: 'bold' },
  taskDoodle: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 218, 185, 0.95)',
    paddingVertical: 5, paddingHorizontal: 5, borderWidth: 1.5, borderColor: '#D2691E', 
    borderTopRightRadius: 15, borderBottomLeftRadius: 10,
  },
  taskDoodleText: { ...handwrittenFont, fontSize: 16, color: '#222', marginLeft: 5, flexShrink: 1 },
  iconBox: { width: 20, height: 20, position: 'relative' },
  doodleLine: { position: 'absolute', height: 2.5, backgroundColor: '#222', borderRadius: 2 },
  doodleCircle: { position: 'absolute', width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: '#222' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  postIt: { width: '80%', padding: 25, paddingTop: 35, borderBottomRightRadius: 15, shadowColor: '#000', shadowOffset: { width: 2, height: 4 }, shadowOpacity: 0.4, shadowRadius: 5, elevation: 10, transform: [{ rotate: '2deg' }] },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  modalTitle: { ...handwrittenFont, fontSize: 26, fontWeight: 'bold', color: '#222', marginLeft: 10 },
  modalMessage: { ...handwrittenFont, fontSize: 20, color: '#444', textAlign: 'center', marginTop: 10 }
});