// (Punto 3 guia 5 : Aquí se evidencia que al usar React Native (JSX), el entorno de desarrollo es inherentemente 
// más estricto que HTML. No necesitamos usar el servicio de validación de la W3C para certificar que el código 
// sea "Well-Formed", ya que si rompemos alguna regla de sintaxis (etiquetas sin cerrar, mal anidamiento, etc.), 
// el compilador de React y nuestro linter (ESLint) arrojarán un error fatal y la aplicación simplemente no compilará, 
// garantizando el control de calidad automáticamente).

import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Platform, SafeAreaView, KeyboardAvoidingView 
} from 'react-native';

import { AuthContext } from '../../App';

import { 
  DoodleSun, DoodleArrow, DoodleCheck, DoodleModal, 
  LinedPaper, HandDrawnSolidButton 
} from '../components/Doodles';

export function LoginScreen({ navigation }) {
  // (Punto 2 guia 6: Implementación de Controles de Usuario. Aquí se declaran los estados de React (email y password) que equivalen y reemplazan al atributo "name" tradicional de HTML, actuando como identificadores de las variables para el servidor)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { signIn } = React.useContext(AuthContext);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '', isError: false });

  const showModal = (title, message, isError = true) => {
    setModalData({ title, message, isError });
    setModalVisible(true);
  };

  // (Punto 2 guia 6: Arquitectura de Captura. Esta función envuelve la lógica del login. A través del contexto (signIn), actúa como el atributo "action", definiendo hacia dónde van los datos y asegurando el "method" POST para el envío seguro de la información).
  const handleLogin = async () => {
    if(!email || !password) return showModal('Espera', '¡Faltan datos!', true);
    const result = await signIn(email, password);
    if (!result.success) showModal('Oops', result.error, true);
  };

  return (
    <SafeAreaView style={styles.deskBackground}>
      {/* (Punto 1 guia 6: ESTRUCTURACIÓN DINÁMICA DE LA INTERFAZ. Se implementan contenedores estructurados como KeyboardAvoidingView y LinedPaper para segmentar lógicamente la sección de captura del Login, manteniendo la integridad visual) */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.centerContainer}>
        <DoodleModal visible={modalVisible} {...modalData} onClose={() => setModalVisible(false)} />
        <LinedPaper>
          <Text style={styles.handwrittenTitle}>LightLife</Text>
          <View style={styles.subtitleContainer}>
            <DoodleSun />
            <Text style={styles.doodleSubtitle}>Inicia tu dia...</Text>
          </View>
          
          <View style={styles.inputContainer}>
            {/* (Punto 2 guia 6: Implementación de Controles de Usuario. Uso del <TextInput> equivalente a un <input>. Se asocia visualmente mediante el estado onChangeText={setEmail} preparándolo para el procesamiento) */}
            <Text style={styles.handwrittenLabel}>Correo:</Text>
            <TextInput style={styles.handwrittenInput} placeholder="alguien@email.com" autoCapitalize="none" onChangeText={setEmail} />
          </View>
          <View style={styles.inputContainer}>
            {/* (Punto 2 guia 6: Implementación de Controles de Usuario. Uso de la propiedad secureTextEntry, equivalente a un input type="password") */}
            <Text style={styles.handwrittenLabel}>Secreto:</Text>
            <TextInput style={styles.handwrittenInput} secureTextEntry placeholder="***" onChangeText={setPassword} />
          </View>
          
          {/* (Punto 2 guia 6: Implementación de Controles de Usuario. El botón HandDrawnSolidButton ejecuta la acción de envío (handleLogin), funcionando como un input type="submit") */}
          <HandDrawnSolidButton title="Entrar" Icon={DoodleArrow} onPress={handleLogin} style={{marginTop: 15}} />
          
          {/* (Punto 3 guia 6: Vinculación y Navegabilidad. Se establece la conectividad técnica (equivalente a enlaces relativos) utilizando React Navigation para transicionar entre módulos (Login y Registro)) */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{marginTop: 30}}>
            <Text style={styles.linkText}>¿No tienes cuenta? Créala aquí</Text>
          </TouchableOpacity>
        </LinedPaper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function RegisterScreen({ navigation }) {
  // (Punto 2 guia 6: Implementación de Controles de Usuario. Declaración de las variables que servirán como identificadores de los datos capturados para el registro)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '', isError: false });
  const [isSuccess, setIsSuccess] = useState(false);

  const BACKEND_URL = 'http://localhost:3000'; 

  const showModal = (title, message, isError = true, success = false) => {
    setModalData({ title, message, isError });
    setIsSuccess(success);
    setModalVisible(true);
  };

  // (Punto 2 guia 6: Arquitectura de Captura. Se establece directamente el método fetch con method="POST" apuntando al endpoint "/auth/register" (equivalente al action), garantizando el flujo seguro desde el frontend hacia el backend)
  const handleRegister = async () => {
    if(!name || !email || !password) return showModal('Cuidado', 'No dejes renglones vacíos.', true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) showModal('¡Listo!', 'Tu cuenta fue creada.', false, true);
      else showModal('Error', data.error || 'Problema al guardar.', true);
    } catch (error) {
      showModal('Error', 'Servidor apagado o IP incorrecta.', true);
    }
  };

  return (
    <SafeAreaView style={styles.deskBackground}>
      {/* (Punto 1 guia 6: ESTRUCTURACIÓN DINÁMICA DE LA INTERFAZ. Contenedores estructurados con id/roles lógicos dentro del componente) */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.centerContainer}>
        <DoodleModal visible={modalVisible} {...modalData} onClose={() => { setModalVisible(false); if(isSuccess) navigation.goBack(); }} />
        <LinedPaper>
          <Text style={styles.handwrittenTitle}>Registro</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.handwrittenLabel}>Nombre:</Text>
            <TextInput style={styles.handwrittenInput} onChangeText={setName} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.handwrittenLabel}>Correo:</Text>
            <TextInput style={styles.handwrittenInput} autoCapitalize="none" onChangeText={setEmail} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.handwrittenLabel}>Secreto:</Text>
            <TextInput style={styles.handwrittenInput} secureTextEntry onChangeText={setPassword} />
          </View>
          <HandDrawnSolidButton title="Guardar" Icon={DoodleCheck} onPress={handleRegister} style={{marginTop: 15}} />
          
          {/* (Punto 3 guia 6: Vinculación y Navegabilidad. Uso de "navigation.goBack()" como transición coherente hacia la pantalla anterior del flujo de autenticación) */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 20}}>
            <Text style={styles.linkText}>Volver atrás</Text>
          </TouchableOpacity>
        </LinedPaper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const handwrittenFont = {
  fontFamily: Platform.OS === 'ios' ? 'Noteworthy' : 'casual',
  fontStyle: Platform.OS === 'android' ? 'italic' : 'normal',
};

const styles = StyleSheet.create({
  deskBackground: { flex: 1, backgroundColor: '#E6D2B5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
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
  linkText: { ...handwrittenFont, textAlign: 'center', fontSize: 16, color: '#00008b', textDecorationLine: 'underline' }
});