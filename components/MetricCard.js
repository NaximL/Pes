import { View, Text, StyleSheet } from 'react-native';

export default function MetricCard({ title, value, unit, color }) {
  return (
    <View style={[styles.card, { borderColor: color || '#333' }]}>

      <Text style={styles.title}>{title}</Text>

      <Text style={[styles.value, { color: color || '#fff' }]}>
        {value}
        {unit ? ` ${unit}` : ''}
      </Text>

    </View>
  );
    }

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#272727',
    borderRadius: 12,
    padding: 14,
    minWidth: 160,
    alignItems: 'center',
    borderWidth: 1,
    margin: 8,
  },
  title: { color: '#bfbfbf', fontSize: 12 },
  value: { fontSize: 22, fontWeight: '700', marginTop: 6 },
});
