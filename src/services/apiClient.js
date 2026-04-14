import AsyncStorage from '@react-native-async-storage/async-storage';

// guia 5 punto 1 aqui usamos el equivalente de centralizar la lógica de red para evitar el "Acoplamiento Fuerte".
// Si el BACKEND_URL cambia, solo debemos modificar este archivo, y no tener que buscar en cada pantalla.
const BACKEND_URL = 'http://localhost:3000';

export const apiClient = {
  async fetch(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
    
    // Si la respuesta es JSON, la procesamos
    const textData = await response.text(); 
    
    let data;
    try { 
      data = JSON.parse(textData); 
    } catch (e) { 
      throw new Error("Servidor falló. Revisa la consola."); 
    }

    if (!response.ok) {
      throw new Error(data.error || 'Error en la petición al servidor');
    }

    return data;
  },

  // Centralizamos la lógica de registro (Alta Cohesión)
  register(name, email, password) {
    return this.fetch('/auth/register', 'POST', { name, email, password });
  }
};
