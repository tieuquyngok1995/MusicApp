import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default function RoleDialog({ visible, onSelectRole, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Bạn là teacher hay student?</Text>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#4caf50' }]}
            onPress={() => onSelectRole('teacher')}
          >
            <Text style={styles.cardText}>Teacher</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#2196f3' }]}
            onPress={() => onSelectRole('student')}
          >
            <Text style={styles.cardText}>Student</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

RoleDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onSelectRole: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 260,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
