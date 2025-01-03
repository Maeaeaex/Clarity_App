import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';

// Define the props type
type AudioButtonProps = {
  audioFile: number | string; // For local files
};

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const AudioButton: React.FC<AudioButtonProps> = ({ audioFile }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggleAudio = async () => {
    setIsLoading(true);

    try {
      if (!sound) {
        // Load and play the sound for the first time
        const { sound: newSound } = await Audio.Sound.createAsync(audioFile);
        const status = await newSound.getStatusAsync();

        setSound(newSound);
        setDuration(status.durationMillis || 0);
        await newSound.playAsync();
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (status.isLoaded) {
            setCurrentTime(status.positionMillis || 0);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setSound(null);
              setCurrentTime(0);
            }
          }
        });
      } else {
        if (isPlaying) {
          // Pause playback
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          // Resume playback
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error handling audio playback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isPlaying ? styles.buttonPlaying : styles.buttonIdle]}
        onPress={toggleAudio}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>{isPlaying ? 'Pause' : 'Breathing to manage stress'}</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.timer}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: "#121212"
  },
  buttonIdle: {
    backgroundColor: "#121212",
  },
  buttonPlaying: {
    backgroundColor: '#FF5722',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  timer: {
    fontSize: 14,
    color: '#555',
  },
});

export default AudioButton;


