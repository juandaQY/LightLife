// (Punto 3 guia 5 : Aquí se evidencia que al usar React Native (JSX), el entorno de desarrollo es inherentemente 
// más estricto que HTML. No necesitamos usar el servicio de validación de la W3C para certificar que el código 
// sea "Well-Formed", ya que si rompemos alguna regla de sintaxis (etiquetas sin cerrar, mal anidamiento, etc.), 
// el compilador de React y nuestro linter (ESLint) arrojarán un error fatal y la aplicación simplemente no compilará,
// garantizando el control de calidad automáticamente).

import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, Platform, SafeAreaView, Modal, ActivityIndicator,
  Animated, PanResponder, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from '../../App';
import { 
  DoodlePin, DoodleGear, DoodleWarning, 
  HandDrawnSolidButton, LinedPaper, DoodleArrowLeft, DoodleArrow
} from '../components/Doodles';

const BACKEND_URL = 'http://localhost:3000'; 
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const formatTime = (decimalHour) => {
  const h = Math.floor(decimalHour);
  const m = Math.round((decimalHour - h) * 60);
  return `${h}:${m === 0 ? '00' : m}`;
};

const postItColors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const DraggableTask = ({ task, onDrop, colWidth, rowHeight, isDaily }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  
  const bgColor = postItColors[task.id % postItColors.length];
  const span = task.rowSpan || 1;
  const taskHeight = (rowHeight * span) - 8;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setValue({ x: 0, y: 0 }); 
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        setIsDragging(false);
        
        const colsMoved = isDaily ? 0 : Math.round(gesture.dx / colWidth);
        const rowsMoved = Math.round(gesture.dy / rowHeight);

        if (colsMoved !== 0 || rowsMoved !== 0) {
          onDrop(task, colsMoved, rowsMoved);
        }
        
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  // (Punto 1 guia 5 : aqui es donde se declara el elemento raíz de este componente (Animated.View),
  //  asegurando un anidamiento jerárquico perfecto compatible con el árbol del DOM en React, 
  // equivalente al estandar estricto de XML)
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.stickyNote,
        Platform.OS === 'web' && { userSelect: 'none', cursor: isDragging ? 'grabbing' : 'grab' },
        {
          backgroundColor: bgColor,
          position: 'absolute',
          left: isDaily ? 65 : task.colIndex * colWidth + 65, 
          top: task.rowIndex * rowHeight + 4,
          width: colWidth - 10,
          height: taskHeight,
          transform: [
            { translateX: pan.x }, 
            { translateY: pan.y }, 
            { rotate: isDragging ? '4deg' : '-1.5deg' },
            { scale: isDragging ? 1.05 : 1 }
          ],
          zIndex: isDragging ? 100 : 10,
          shadowColor: '#000', shadowOffset: { width: 4, height: isDragging ? 8 : 4 }, 
          shadowOpacity: isDragging ? 0.4 : 0.25, elevation: isDragging ? 15 : 5
        }
      ]}
    >
      {/* (Punto 2 guia 5 : aqui se encuentra el equivalente en React del cierre obligatorio de elementos vacíos de XHTML. 
      En JSX, si no cierras etiquetas como <View /> o <DoodlePin />, el código arroja error fatal) */}
      <View style={styles.stickyNoteFold} />
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <DoodlePin />
        <View style={{flex: 1, overflow: 'hidden', paddingLeft: 5, paddingTop: 2}}>
          <Text style={styles.taskDoodleText} numberOfLines={span * 2}>{task.title}</Text>
          {span > 1 && <Text style={styles.durationText}>{span} bloque(s)</Text>}
        </View>
      </View>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);
  
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  
  const [hasConfigured, setHasConfigured] = useState(false);
  const [config, setConfig] = useState({ startHour: 6, totalHours: 16, interval: 1 });
  const [tempConfig, setTempConfig] = useState({ startHour: '6', totalHours: '16', interval: '1' });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [viewMode, setViewMode] = useState('weekly'); 
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [conflictData, setConflictData] = useState(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);

  // (Punto 2 guia 6: Implementación de Controles de Usuario. Aquí se declaran los estados de React equivalentes al atributo "name" en HTML, que capturarán y actuarán como identificadores de las variables para el envío de datos)
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState('1'); 

  useEffect(() => { loadCalendarData(); }, []);

  const fetchWithToken = async (endpoint, method = 'GET', body = null) => {
    const token = await AsyncStorage.getItem('userToken');
    const options = { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(`${BACKEND_URL}${endpoint}`, options);
    try { return await res.json(); } catch (e) { throw new Error(`Error servidor`); }
  };

  const loadCalendarData = async () => {
    try {
      const data = await fetchWithToken('/api/calendar');
      if (data.error) {
        setServerError(data.error);
        if (data.error === 'Invalid token' || data.error === 'Usuario no encontrado') signOut();
      } else {
        if (data.config) {
          setConfig(data.config);
          setTempConfig({ startHour: String(data.config.startHour), totalHours: String(data.config.totalHours), interval: String(data.config.interval) });
          setHasConfigured(data.config.hasConfigured);
        }
        if (data.tasks) setTasks(data.tasks);
      }
    } catch (e) { setServerError(e.message); }
    setIsLoading(false);
  };

  const handleSaveConfig = async () => {
    const newConfig = {
      startHour: parseFloat(tempConfig.startHour) || 6,
      totalHours: parseFloat(tempConfig.totalHours) || 16,
      interval: parseFloat(tempConfig.interval) || 1
    };
    setConfig(newConfig);
    setHasConfigured(true);
    setShowSettingsModal(false);
    await fetchWithToken('/api/config', 'POST', newConfig);
  };

  // (Punto 2 guia 6: Arquitectura de Captura. Esta función actúa como el equivalente nativo a la etiqueta <form>,
  //  definiendo internamente en fetchWithToken el archivo receptor (action) y el verbo de envío 'POST' (method)
  //  asegurando el envío de información)
  const handleCreateTask = async () => {
    if(!newTaskTitle) return;
    setShowCreateModal(false);
    const durationHours = parseFloat(newTaskDuration) || 1;
    const rowSpan = Math.max(1, Math.ceil(durationHours / config.interval));
    const targetCol = viewMode === 'daily' ? currentDayIndex : 0;

    const newTaskParams = { title: newTaskTitle, colIndex: targetCol, rowIndex: 0, rowSpan };
    const savedTask = await fetchWithToken('/api/tasks', 'POST', newTaskParams);
    
    if (savedTask && !savedTask.error) setTasks([...tasks, savedTask]);
    setNewTaskTitle(''); setNewTaskDuration('1');
  };

  const updateTasksInDB = async (tasksToUpdate) => {
    const updates = tasksToUpdate.map(t => ({ id: t.id, colIndex: t.colIndex, rowIndex: t.rowIndex }));
    await fetchWithToken('/api/tasks/positions', 'PUT', { updates });
  };

  const handleDrop = (task, colsMoved, rowsMoved) => {
    const maxRows = Math.ceil(config.totalHours / config.interval);
    
    const newColIndex = viewMode === 'daily' ? task.colIndex : Math.max(0, Math.min(6, task.colIndex + colsMoved));
    const newRowIndex = Math.max(0, Math.min(maxRows - task.rowSpan, task.rowIndex + rowsMoved));

    const existingTask = tasks.find(t => t.colIndex === newColIndex && t.rowIndex === newRowIndex && t.id !== task.id);

    if (existingTask) setConflictData({ task, newColIndex, newRowIndex });
    else {
      const updatedTask = { ...task, colIndex: newColIndex, rowIndex: newRowIndex };
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      updateTasksInDB([updatedTask]); 
    }
  };

  const resolveConflict = (shift) => {
    if (!conflictData) return;
    const { task, newColIndex, newRowIndex } = conflictData;
    if (shift) {
      let movedTasksList = [];
      setTasks(prev => {
        let updated = [...prev];
        updated = updated.map(t => {
          if (t.colIndex === newColIndex && t.rowIndex >= newRowIndex && t.id !== task.id) {
            const shiftedTask = { ...t, rowIndex: t.rowIndex + task.rowSpan };
            movedTasksList.push(shiftedTask); return shiftedTask;
          }
          return t;
        });
        const droppedTask = { ...task, colIndex: newColIndex, rowIndex: newRowIndex };
        updated = updated.map(t => t.id === task.id ? droppedTask : t);
        movedTasksList.push(droppedTask);
        updateTasksInDB(movedTasksList); 
        return updated;
      });
    }
    setConflictData(null);
  };

  if (isLoading) return <ActivityIndicator size="large" color="#FDFBF7" style={{flex:1, backgroundColor:'#4A3B2C', justifyContent: 'center'}} />;

  if (serverError) return ( <View><Text>Error</Text></View>);

  const timeSlots = Array.from({ length: Math.ceil(config.totalHours / config.interval) }, (_, i) => config.startHour + (i * config.interval));
  
  const isDaily = viewMode === 'daily';
  const COL_WIDTH = isDaily ? (Platform.OS === 'web' ? 400 : SCREEN_WIDTH - 120) : 140; 
  const ROW_HEIGHT = 85; 

  const renderConfigModal = (visible, isEditMode = false) => (
    // (Punto 2 guia 5 : aqui se evidencia el uso estricto de sintaxis obligando a que los valores de atributos, 
    // como animationType="slide", usen comillas dobles, regla crítica de XHTML heredada por JSX)
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.postIt, { backgroundColor: '#FFF9C4', width: '90%', maxWidth: 500 }]}>
          <View style={styles.tape} />
          <View style={styles.modalHeader}>
            <DoodleGear />
            <Text style={styles.modalTitle}>{isEditMode ? "Ajustes" : "Reglas de la Libreta"}</Text>
          </View>
          
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, marginTop: 10}}>
            {/* (Punto 1 guia 6: ESTRUCTURACIÓN DINÁMICA DE LA INTERFAZ. Aquí utilizamos un contenedor <View>
             para aislar las lógicas de captura de la hora inicial, manteniendo una segmentación lógica sin irrumpir 
             otros elementos en la UI) */}
            <View style={{flex: 1, marginRight: 10}}>
              <Text style={styles.handwrittenLabel}>Inicia (Ej. 6):</Text>
              <TextInput style={styles.handwrittenInput} keyboardType="numeric" value={tempConfig.startHour} onChangeText={(t) => setTempConfig({...tempConfig, startHour: t})} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.handwrittenLabel}>Horas (Ej. 16):</Text>
              <TextInput style={styles.handwrittenInput} keyboardType="numeric" value={tempConfig.totalHours} onChangeText={(t) => setTempConfig({...tempConfig, totalHours: t})} />
            </View>
          </View>

          <Text style={styles.handwrittenLabel}>Intervalo (1 = 1h | 1.5 = 1h30m):</Text>
          <TextInput style={styles.handwrittenInput} keyboardType="numeric" value={tempConfig.interval} onChangeText={(t) => setTempConfig({...tempConfig, interval: t})} />

          {isEditMode && (
            <View style={{marginTop: 20}}>
              <Text style={styles.handwrittenLabel}>Modo de Vista:</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
                <TouchableOpacity 
                  style={[styles.viewModeBtn, viewMode === 'weekly' && styles.viewModeBtnActive]} 
                  onPress={() => setViewMode('weekly')}>
                  <Text style={[styles.handwrittenLabel, {marginBottom: 0}]}>Semana</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.viewModeBtn, viewMode === 'daily' && styles.viewModeBtnActive]} 
                  onPress={() => setViewMode('daily')}>
                  <Text style={[styles.handwrittenLabel, {marginBottom: 0}]}>Página</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <HandDrawnSolidButton title="Guardar Cambios" onPress={handleSaveConfig} style={{marginTop: 25}} />
          {isEditMode && <TouchableOpacity onPress={() => setShowSettingsModal(false)} style={{marginTop: 15}}><Text style={styles.linkText}>Cancelar</Text></TouchableOpacity>}
        </View>
      </View>
    </Modal>
  );

  // (Punto 1 guia 5 : aqui es donde se encuentra el equivalente de react al "elemento raíz" principal de la pantalla, 
  // envolviendo toda la vista y asegurando que se retorne un único nodo validado por el DOM virtual de React)
  return (
    <SafeAreaView style={styles.deskBackground}>
      {renderConfigModal(!hasConfigured, false)}
      {renderConfigModal(showSettingsModal, true)}

      <Modal visible={!!conflictData} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.postIt, { backgroundColor: '#FFD1DC', maxWidth: 400 }]}>
            <View style={styles.tape} />
            <View style={styles.modalHeader}><DoodleWarning /><Text style={styles.modalTitle}>¡Choque de tareas!</Text></View>
            <Text style={styles.modalMessage}>Ya hay un garabato en ese horario.</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 25}}>
              <TouchableOpacity onPress={() => setConflictData(null)} style={{padding: 10}}><Text style={styles.linkText}>Cancelar</Text></TouchableOpacity>
              <HandDrawnSolidButton title="Aplazar" bgColor="#FF9999" onPress={() => resolveConflict(true)} />
            </View>
          </View>
        </View>
      </Modal>

      {/* (Punto 1 guia 6: ESTRUCTURACIÓN DINÁMICA DE LA INTERFAZ. Este Modal representa una sección de captura o
       "Formulario" dinámico dentro de la interfaz, utilizando componentes para la segmentación lógica de la interfaz 
       y la entrada de datos) */}
      <Modal visible={showCreateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.postIt, { backgroundColor: '#A8E6CF', maxWidth: 400 }]}>
            <View style={styles.tape} />
            <Text style={styles.modalTitle}>Nuevo Pendiente</Text>
            {/* (Punto 2 guia 6: Implementación de Controles de Usuario. Uso del <TextInput> equivalente a un <input> donde se definen diversos tipos mediante propiedades como keyboardType="numeric", y se integran visualmente a través del estado para el envío) */}
            <Text style={[styles.handwrittenLabel, {marginTop: 15}]}>¿Qué vas a hacer?</Text>
            <TextInput style={styles.handwrittenInput} placeholder="Ej: Proyecto..." value={newTaskTitle} onChangeText={setNewTaskTitle} />
            <Text style={[styles.handwrittenLabel, {marginTop: 15}]}>¿Cuántas horas tomará?</Text>
            <TextInput style={styles.handwrittenInput} keyboardType="numeric" placeholder="Ej: 2" value={newTaskDuration} onChangeText={setNewTaskDuration} />
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 25}}>
              <TouchableOpacity onPress={() => setShowCreateModal(false)} style={{padding: 10}}><Text style={styles.linkText}>Cancelar</Text></TouchableOpacity>
              {/* (Punto 2 guia 6: Implementación de Controles de Usuario. Botón equivalente a un submit que ejecuta la lógica de petición al backend) */}
              <HandDrawnSolidButton title="Pegar" bgColor="#77DD77" onPress={handleCreateTask} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.headerText}>Mi Libreta</Text>
        <View style={{flexDirection: 'row'}}>
          <HandDrawnSolidButton title="" Icon={DoodleGear} bgColor="#E0E0E0" onPress={() => setShowSettingsModal(true)} style={{ paddingVertical: 5, paddingHorizontal: 10, marginRight: 10 }} />
          <HandDrawnSolidButton title="Nuevo +" bgColor="#A8E6CF" onPress={() => setShowCreateModal(true)} style={{ paddingVertical: 5, paddingHorizontal: 10 }} />
        </View>
      </View>

      {isDaily && (
        <View style={styles.dailyControls}>
          <TouchableOpacity onPress={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))} style={{padding: 10, opacity: currentDayIndex === 0 ? 0.3 : 1}}>
             <DoodleArrowLeft />
          </TouchableOpacity>
          <View style={[styles.washiTape, { backgroundColor: postItColors[currentDayIndex % postItColors.length], paddingHorizontal: 30 }]}>
            <Text style={[styles.handwrittenLabel, {fontWeight: 'bold', fontSize: 24, marginBottom: 0}]}>{days[currentDayIndex]}</Text>
          </View>
          <TouchableOpacity onPress={() => setCurrentDayIndex(Math.min(6, currentDayIndex + 1))} style={{padding: 10, opacity: currentDayIndex === 6 ? 0.3 : 1}}>
             <DoodleArrow />
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flex: 1, paddingHorizontal: Platform.OS === 'web' ? '10%' : 15, paddingBottom: 25 }}>
        <View style={styles.notebookCover}>
          
          <View style={styles.binderRings}>
            {Array.from({ length: 18 }).map((_, i) => (
              <View key={i} style={styles.ringContainer}>
                <View style={styles.hole} />
                <View style={styles.metalRing} />
              </View>
            ))}
          </View>

          <View style={styles.redMargin} />

          <ScrollView horizontal={!isDaily} showsHorizontalScrollIndicator={false} style={{ marginLeft: 35 }}>
            <View>
              {!isDaily && (
                <View style={{ flexDirection: 'row', paddingLeft: 60, paddingBottom: 10, marginTop: 15 }}>
                  {days.map((d, i) => (
                    <View key={i} style={{ width: COL_WIDTH, alignItems: 'center' }}>
                      <View style={[styles.washiTape, { backgroundColor: postItColors[i % postItColors.length] }]}>
                        <Text style={[styles.handwrittenLabel, {fontWeight: 'bold', fontSize: 18, marginBottom: 0}]}>{d}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {isDaily && <View style={{height: 20}} />}

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ position: 'relative', width: (isDaily ? 1 : 7) * COL_WIDTH + 60, height: timeSlots.length * ROW_HEIGHT, paddingBottom: 50 }}>
                  
                  {timeSlots.map((time, rIndex) => (
                    <View key={rIndex} style={{ flexDirection: 'row', position: 'absolute', top: rIndex * ROW_HEIGHT }}>
                      <View style={{ width: 60, height: ROW_HEIGHT, alignItems: 'center', paddingTop: 10 }}>
                        <Text style={styles.timeText}>{formatTime(time)}</Text>
                      </View>
                      <View style={{ width: (isDaily ? 1 : 7) * COL_WIDTH, height: ROW_HEIGHT, borderBottomWidth: 1.5, borderBottomColor: '#A1C6EA' }}>
                        {!isDaily && (
                          <View style={{flexDirection: 'row', width: '100%', height: '100%'}}>
                             {days.map((_, cIndex) => <View key={cIndex} style={{width: COL_WIDTH, borderRightWidth: 1, borderRightColor: 'rgba(161, 198, 234, 0.4)'}} />)}
                          </View>
                        )}
                      </View>
                    </View>
                  ))}

                  {tasks.filter(t => !isDaily || t.colIndex === currentDayIndex).map(task => (
                    <DraggableTask 
                      key={task.id} task={task} onDrop={handleDrop} colWidth={COL_WIDTH} rowHeight={ROW_HEIGHT} isDaily={isDaily}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const handwrittenFont = { fontFamily: Platform.OS === 'ios' ? 'Noteworthy' : 'casual', fontStyle: Platform.OS === 'android' ? 'italic' : 'normal' };

const styles = StyleSheet.create({
  deskBackground: { flex: 1, backgroundColor: '#4A3B2C' }, 
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: Platform.OS === 'android' ? 40 : 20, alignItems: 'center' },
  headerText: { ...handwrittenFont, fontSize: 36, color: '#FDFBF7', fontWeight: 'bold', textShadowColor: '#222', textShadowOffset: {width: 1, height: 2}, textShadowRadius: 3 },
  
  dailyControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 15 },
  viewModeBtn: { padding: 10, borderWidth: 2, borderColor: '#ccc', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.5)'},
  viewModeBtnActive: { borderColor: '#4A3B2C', backgroundColor: 'rgba(255,255,255,1)' },

  notebookCover: {
    flex: 1, backgroundColor: '#FDFBF7', borderRadius: 8, borderTopLeftRadius: 5, borderBottomLeftRadius: 5,
    shadowColor: '#000', shadowOffset: { width: 8, height: 12 }, shadowOpacity: 0.6, shadowRadius: 15, elevation: 20, overflow: 'hidden',
  },
  binderRings: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 35, backgroundColor: '#F2F2F2',
    borderRightWidth: 1, borderRightColor: '#D9D9D9', justifyContent: 'space-evenly', alignItems: 'center', zIndex: 5,
    shadowColor: '#000', shadowOffset: {width: 3, height: 0}, shadowOpacity: 0.1, elevation: 5
  },
  ringContainer: { flexDirection: 'row', alignItems: 'center', width: 45, marginLeft: 15 },
  hole: {
    width: 14, height: 14, borderRadius: 7, backgroundColor: '#4A3B2C', 
    borderWidth: 1, borderColor: '#CCC', shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.8, shadowRadius: 1
  },
  metalRing: {
    width: 25, height: 6, backgroundColor: '#D4D4D4', borderRadius: 3, marginLeft: -5,
    borderWidth: 1, borderColor: '#999', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.5, shadowRadius: 2
  },
  redMargin: { position: 'absolute', left: 90, top: 0, bottom: 0, width: 2, backgroundColor: '#FFBDBD', zIndex: 1 },

  washiTape: {
    paddingVertical: 5, paddingHorizontal: 15, transform: [{ rotate: '-2deg' }],
    opacity: 0.9, shadowColor: '#000', shadowOffset: {width: 1, height: 2}, shadowOpacity: 0.2, elevation: 3,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  stickyNote: {
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', borderBottomRightRadius: 20, borderTopLeftRadius: 2,
    paddingRight: 10 
  },
  stickyNoteFold: {
    position: 'absolute', bottom: 0, right: 0, width: 25, height: 25,
    backgroundColor: 'rgba(0,0,0,0.05)', borderTopLeftRadius: 25, 
    borderBottomWidth: 1, borderRightWidth: 1, borderColor: 'rgba(0,0,0,0.02)'
  },
  
  taskDoodleText: { ...handwrittenFont, fontSize: 20, color: '#222', fontWeight: 'bold' },
  durationText: { ...handwrittenFont, fontSize: 14, color: '#555', marginTop: 2, opacity: 0.8 },
  timeText: { ...handwrittenFont, color: '#666', fontSize: 16, fontWeight: 'bold' },
  handwrittenLabel: { ...handwrittenFont, fontSize: 18, color: '#333', marginBottom: 5 },
  handwrittenInput: {
    ...handwrittenFont, fontSize: 20, color: '#00008b', paddingVertical: 10, paddingHorizontal: 15,
    borderWidth: 2, borderColor: '#333', borderTopLeftRadius: 15, borderTopRightRadius: 4,
    borderBottomRightRadius: 18, borderBottomLeftRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ rotate: '0.5deg' }]
  },
  linkText: { ...handwrittenFont, textAlign: 'center', fontSize: 16, color: '#00008b', textDecorationLine: 'underline' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  postIt: { padding: 25, paddingTop: 35, borderBottomRightRadius: 15, shadowColor: '#000', shadowOffset: { width: 3, height: 6 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 15, transform: [{ rotate: '1deg' }] },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  modalTitle: { ...handwrittenFont, fontSize: 26, fontWeight: 'bold', color: '#222', marginLeft: 10 },
  modalMessage: { ...handwrittenFont, fontSize: 20, color: '#444', textAlign: 'center', marginTop: 10 },
  tape: { position: 'absolute', top: -5, alignSelf: 'center', width: 110, height: 35, backgroundColor: 'rgba(255, 248, 220, 0.8)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', transform: [{ rotate: '3deg' }], zIndex: 3 }
});