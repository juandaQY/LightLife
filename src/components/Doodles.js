import React from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, Modal, Platform 
} from 'react-native';

export const DoodleArrow = () => (
  <View style={styles.iconBox}>
    <View style={[styles.doodleLine, { width: 15, top: 10, left: 2 }]} />
    <View style={[styles.doodleLine, { width: 8, top: 7, left: 10, transform: [{ rotate: '45deg' }] }]} />
    <View style={[styles.doodleLine, { width: 8, top: 13, left: 10, transform: [{ rotate: '-45deg' }] }]} />
  </View>
);

export const DoodleArrowLeft = () => (
  <View style={styles.iconBox}>
    <View style={[styles.doodleLine, { width: 15, top: 10, left: 3 }]} />
    <View style={[styles.doodleLine, { width: 8, top: 7, left: 2, transform: [{ rotate: '-45deg' }] }]} />
    <View style={[styles.doodleLine, { width: 8, top: 13, left: 2, transform: [{ rotate: '45deg' }] }]} />
  </View>
);

export const DoodleCheck = () => (
  <View style={styles.iconBox}>
    <View style={[styles.doodleLine, { width: 8, top: 12, left: 2, transform: [{ rotate: '45deg' }] }]} />
    <View style={[styles.doodleLine, { width: 16, top: 8, left: 5, transform: [{ rotate: '-55deg' }] }]} />
  </View>
);

export const DoodlePin = () => (
  <View style={styles.iconBox}>
    <View style={[styles.doodleCircle, { top: 2, left: 5, borderColor: '#8B0000', backgroundColor: '#FF6B6B' }]} />
    <View style={[styles.doodleLine, { width: 10, top: 12, left: 5, transform: [{ rotate: '80deg' }] }]} />
  </View>
);

export const DoodleSun = () => (
  <View style={styles.iconBox}>
    <View style={[styles.doodleCircle, { top: 5, left: 5, width: 10, height: 10 }]} />
    <View style={[styles.doodleLine, { width: 4, top: 2, left: 8, transform: [{ rotate: '90deg' }] }]} />
    <View style={[styles.doodleLine, { width: 4, top: 16, left: 8, transform: [{ rotate: '90deg' }] }]} />
    <View style={[styles.doodleLine, { width: 4, top: 9, left: 1 }]} />
    <View style={[styles.doodleLine, { width: 4, top: 9, left: 15 }]} />
  </View>
);

export const DoodleWarning = () => (
  <View style={styles.iconBox}>
    <View style={[styles.doodleLine, { width: 14, top: 2, left: 3, transform: [{ rotate: '60deg' }] }]} />
    <View style={[styles.doodleLine, { width: 14, top: 2, left: 3, transform: [{ rotate: '-60deg' }] }]} />
    <View style={[styles.doodleLine, { width: 14, top: 15, left: 3 }]} />
    <View style={[styles.doodleLine, { width: 2, height: 6, top: 6, left: 9, backgroundColor: '#d32f2f' }]} />
    <View style={[styles.doodleCircle, { width: 2, height: 2, top: 13, left: 9, borderColor: '#d32f2f', backgroundColor: '#d32f2f' }]} />
  </View>
);

export const DoodleGear = () => (
  <View style={[styles.iconBox, { transform: [{scale: 1.2}] }]}>
    <View style={[styles.doodleCircle, { width: 12, height: 12, top: 4, left: 4 }]} />
    <View style={[styles.doodleLine, { width: 18, top: 9, left: 1 }]} />
    <View style={[styles.doodleLine, { width: 18, top: 9, left: 1, transform: [{rotate: '90deg'}] }]} />
    <View style={[styles.doodleLine, { width: 18, top: 9, left: 1, transform: [{rotate: '45deg'}] }]} />
    <View style={[styles.doodleLine, { width: 18, top: 9, left: 1, transform: [{rotate: '-45deg'}] }]} />
    <View style={[styles.doodleCircle, { width: 6, height: 6, top: 7, left: 7, backgroundColor: '#FDFAF0', borderColor: 'transparent' }]} />
  </View>
);

export const HandDrawnSolidButton = ({ title, Icon, onPress, bgColor = '#FFD700', style }) => (
  <TouchableOpacity style={[styles.hdBtnWrapper, style]} onPress={onPress}>
    <View style={[styles.hdStroke, { backgroundColor: bgColor, transform: [{rotate: '1.5deg'}], borderRadius: 12 }]} />
    <View style={[styles.hdStroke, { borderWidth: 2, borderColor: '#222', transform: [{rotate: '-1deg'}], borderRadius: 18, borderTopRightRadius: 4 }]} />
    <View style={[styles.hdStroke, { borderWidth: 1.5, borderColor: '#222', transform: [{rotate: '1.2deg'}], borderRadius: 8, borderBottomLeftRadius: 2 }]} />
    <View style={styles.hdContent}>
      {Icon && <View style={{marginRight: 5}}><Icon /></View>}
      <Text style={styles.hdBtnText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

export const DoodleModal = ({ visible, title, message, isError, onClose, children }) => (
  <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={[styles.postIt, { backgroundColor: isError ? '#FFD1DC' : '#FFF9C4' }]}>
        <View style={styles.tape} />
        <View style={styles.modalHeader}>
          {isError ? <DoodleWarning /> : <DoodleCheck />}
          <Text style={styles.modalTitle}>{title}</Text>
        </View>
        {message ? <Text style={styles.modalMessage}>{message}</Text> : null}
        {children}
        {onClose && (
          <HandDrawnSolidButton title="Entendido" bgColor={isError ? '#FF9999' : '#77DD77'} onPress={onClose} style={{ marginTop: 20 }} />
        )}
      </View>
    </View>
  </Modal>
);

export const LinedPaper = ({ children, style, disableLines = false }) => (
  <View style={[styles.paperSheet, style]}>
    {!disableLines && (
      <View style={styles.paperLinesContainer}>
        {Array.from({ length: 40 }).map((_, i) => (
          <View key={i} style={styles.paperHorizontalLine} />
        ))}
      </View>
    )}
    <View style={styles.notebookMargin} />
    <View style={styles.tape} />
    <View style={styles.paperContent}>
      {children}
    </View>
  </View>
);

// ESTILOS
const handwrittenFont = {
  fontFamily: Platform.OS === 'ios' ? 'Noteworthy' : 'casual',
  fontStyle: Platform.OS === 'android' ? 'italic' : 'normal',
};

const styles = StyleSheet.create({
  iconBox: { width: 20, height: 20, position: 'relative' },
  doodleLine: { position: 'absolute', height: 2.5, backgroundColor: '#222', borderRadius: 2 },
  doodleCircle: { position: 'absolute', width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: '#222' },
  hdBtnWrapper: { position: 'relative', paddingVertical: 10, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' },
  hdStroke: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  hdContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  hdBtnText: { ...handwrittenFont, fontSize: 20, fontWeight: 'bold', color: '#222' },
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  postIt: { width: '85%', padding: 25, paddingTop: 35, borderBottomRightRadius: 15, shadowColor: '#000', shadowOffset: { width: 3, height: 6 }, shadowOpacity: 0.4, shadowRadius: 5, elevation: 10, transform: [{ rotate: '1deg' }] },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  modalTitle: { ...handwrittenFont, fontSize: 26, fontWeight: 'bold', color: '#222', marginLeft: 10 },
  modalMessage: { ...handwrittenFont, fontSize: 20, color: '#444', textAlign: 'center', marginTop: 10 }
});