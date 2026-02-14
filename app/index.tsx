import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getStreak} from '../utils/streak';

const streakImages: Record<number, any> = {
  1: require('../assets/streak-pet-tier1.png'),
  2: require('../assets/streak-pet-tier2.png'),
  3: require('../assets/streak-pet-tier3.png'),
};

function getStreakImage(count: number) {
  if (count <= 0) return null;
  return streakImages[Math.min(count, 3)];
}

export default function Home() {
  const router = useRouter();
  const [streakCount, setStreakCount] = useState(0);
  const [lastCheckin, setLastCheckin] = useState<string | null>(null);

  // Refresh streak data every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      getStreak().then((data) => {
        setStreakCount(data.count);
        setLastCheckin(data.lastCheckin);
      });
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Gym Streak</Text>

      {/* Streak display */}
      <View style={styles.streakContainer}>
        {getStreakImage(streakCount) && (
          <Image source={getStreakImage(streakCount)!} style={styles.streakImage} />
        )}
        <Text style={styles.streakNumber}>{streakCount}</Text>
        <Text style={styles.streakLabel}>
          {streakCount === 1 ? 'day' : 'days'}
        </Text>
        {lastCheckin && (
          <Text style={styles.lastCheckin}>Last check-in: {lastCheckin}</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/camera?type=reference')}
        >
          <Text style={styles.buttonText}>Set Reference Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.checkinButton]}
          onPress={() => router.push('/camera?type=checkin')}
        >
          <Text style={styles.buttonText}>Daily Check-in 📸</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  streakImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  streakNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FF6B35',
    lineHeight: 80,
  },
  streakLabel: {
    fontSize: 20,
    color: '#666',
    marginTop: 4,
  },
  lastCheckin: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkinButton: {
    backgroundColor: '#34C759',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
