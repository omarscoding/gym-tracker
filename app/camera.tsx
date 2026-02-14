import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { incrementStreak, saveReferencePhoto } from '../utils/streak';
import { analyzePhoto } from '../utils/imageAnalysis';

export default function Camera() {
  const [facing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: string }>();

  const isCheckin = type === 'checkin';
  const isReference = type === 'reference';

  if (!permission) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync({ base64: true });
      if (result) {
        setPhoto(result.uri);
        setPhotoBase64(result.base64 ?? null);
      }
    }
  };

  const retake = () => {
    setPhoto(null);
    setPhotoBase64(null);
  };

  const goHome = () => {
    router.back();
  };

  const confirmPhoto = async () => {
    if (!photo) return;
    setConfirming(true);
    try {
      if (isCheckin) {
        if (!photoBase64) {
          Alert.alert('Error', 'Could not read photo data. Please retake.');
          setConfirming(false);
          return;
        }
        // Analyze the photo to check for gym equipment
        const analysis = await analyzePhoto(photoBase64);
        console.log('Analysis result:', JSON.stringify(analysis));

        if (analysis.isGymEquipment) {
          const streakData = await incrementStreak();
          Alert.alert(
            '🔥 Streak Updated!',
            `${analysis.label} detected! You're on a ${streakData.count}-day streak!`,
            [{ text: 'Nice!', onPress: goHome }]
          );
        } else {
          Alert.alert(
            '❌ No Gym Equipment Detected',
            `Detected: "${analysis.label}". Take a photo of a dumbbell or other gym equipment to check in.`,
            [{ text: 'Try Again', onPress: retake }]
          );
        }
      } else if (isReference) {
        await saveReferencePhoto(photo);
        Alert.alert(
          'Reference Saved',
          'Your reference photo has been saved.',
          [{ text: 'OK', onPress: goHome }]
        );
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.preview} />
        <View style={styles.previewOverlay}>
          <Text style={styles.previewTitle}>
            {isCheckin ? 'Confirm Gym Check-in' : 'Save as Reference'}
          </Text>
        </View>
        <View style={styles.previewButtons}>
          <TouchableOpacity style={styles.button} onPress={retake}>
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={confirmPhoto}
            disabled={confirming}
          >
            <Text style={styles.buttonText}>
              {confirming && 'Analyzing...'}
              {!confirming && isCheckin && 'Confirm ✅'}
              {!confirming && !isCheckin && 'Save 💾'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
      <TouchableOpacity style={styles.backButton} onPress={goHome}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    color: '#fff',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  previewTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewButtons: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#34C759',
  },
});
