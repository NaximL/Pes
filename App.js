import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import MetricCard from './components/MetricCard';
import PulseGauge from './components/PulseGauge';
import OxygenGauge from './components/OxygenGauge';


export default function App() {

  const [data, setData] = useState({ bpm: 78, spo2: 98, temp: 37.2, heaterOn: false });

  const [refreshing, setRefreshing] = useState(false);




  const fetchData = async () => {
    try {

      const res = await fetch('http://192.168.4.1');
      const json = await res.json();

      setData({
        bpm: json.bpm ?? data.bpm,
        spo2: json.spo2 ?? data.spo2,
        temp: json.temp ?? data.temp,
        heaterOn: json.heaterOn ?? data.heaterOn,
      });
    } catch (e) {
      console.log('fetch error', e);
    }
  };




  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 3000);
    return () => clearInterval(id);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.header}>Моніторинг</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <MetricCard title="Температура" value={data.temp} unit="°C" color="#F6C85F" />
            <MetricCard title="Обігрів" value={data.heaterOn ? 'Включено' : 'Вимкнено'} color={data.heaterOn ? '#FF9F43' : '#8e8e8e'} />
          </View>
        </View>


        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Пульс (BPM):</Text>
          <PulseGauge bpm={data.bpm} />
        </View>

        <View style={[styles.sectionCard, { marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>Рівень кисню</Text>
          <OxygenGauge spo2={data.spo2} />
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414' },
  scroll: { padding: 18, alignItems: 'center' },
  header: { color: '#FFF', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  section: { width: '100%', marginTop: 6, alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  sectionCard: { width: '100%', marginTop: 18, backgroundColor: '#1f1f1f', borderRadius: 12, padding: 14 },
  sectionTitle: { color: '#dcdcdc', fontSize: 16, fontWeight: '700', marginBottom: 8 },
});