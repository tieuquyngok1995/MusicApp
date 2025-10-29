import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const LessonCard = ({ lesson, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={onPress}
    >
      {lesson.image && <Image source={lesson.image} style={styles.image} />}
      <View style={styles.content}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.description}>{lesson.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

LessonCard.propTypes = {
  lesson: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object, 
    ]),
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default LessonCard;
