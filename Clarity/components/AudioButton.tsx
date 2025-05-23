import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, AppState } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider'; //hier ich slider hinzugefügt
import AsyncStorage from '@react-native-async-storage/async-storage';//neu

// Define the props type
type AudioButtonProps = {
  audioFile: number | string; // For local files
  playText: string; //ich hier hinzugefügt
};

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const AudioButtonTry: React.FC<AudioButtonProps> = ({ audioFile, playText }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null); // Verwenden von useRef
  const [rewardTime, setRewardTime] = useState<string | null>(null); // Belohnungszeit


  //--------hier neu start------
  const saveRewardTime = async (time: number) => {
    try {
      const timeInMinutesAndSeconds = formatTime(time); // Zeit in Minuten und Sekunden formatieren
      await AsyncStorage.setItem('rewardTime', timeInMinutesAndSeconds);
      console.log(`Belohnungszeit gespeichert: ${timeInMinutesAndSeconds}`);
    } catch (error) {
      console.error('Fehler beim Speichern der Belohnungszeit:', error);
    }
  };

  const loadRewardTime = async () => {
    try {
      const storedTime = await AsyncStorage.getItem('rewardTime');
      if (storedTime) {
        setRewardTime(storedTime); // Zustand mit formatiertem String aktualisieren
        console.log(`Gespeicherte Belohnungszeit geladen: ${storedTime}`);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Belohnungszeit:', error);
    }
  };

  // Beim ersten Rendern gespeicherte Zeit laden
  React.useEffect(() => {
    loadRewardTime();
  }, []);

  //--------hier neu stopp------


  /* einschub für Audiostopp wenn tab gewechselt wird oder app in hintergrund geht */
  useEffect(() => {
    // Listener für AppState hinzufügen
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);// Keine Abhängigkeit von sound, verhindert unnötige Neuausführungen

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState !== "active" && soundRef.current && isPlaying) {
      stopAudio();
    }
  };

  /*stoppt audiowiedergabe und setzt die Zeit auf null*/
  const stopAudio = async () => {
    if (soundRef.current) {
      try {
      // Speichern der aktuellen Zeit als Belohnungszeit
      await saveRewardTime(duration); // Speichert die aktuelle Zeit
      setRewardTime(formatTime(duration)); // Aktualisiert den Zustand

      await soundRef.current.stopAsync();
      setIsPlaying(false);
      soundRef.current = null;
      setCurrentTime(0);
    } catch (error) {
      console.error('Fehler beim Stoppen des Audios:', error);
    }
  }
  };

  /*Auch hier Ref genutzt */
  const toggleAudio = async () => {
    setIsLoading(true);

    try {
      if (!soundRef.current) {
        // Load and play the sound for the first time
        const { sound } = await Audio.Sound.createAsync(audioFile);
        soundRef.current = sound
        const status = await sound.getStatusAsync();

        setDuration(status.durationMillis || 0);
        await sound.playAsync();
        setIsPlaying(true);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setCurrentTime(status.positionMillis || 0);
            if (status.didJustFinish) {
              stopAudio();
            }
          }
        });
      } else {
        if (isPlaying) {
          // Pause playback
          await soundRef.current.pauseAsync();
          setIsPlaying(false);

          await saveRewardTime(currentTime); // Speichert die aktuelle Zeit beim Pausieren
          setRewardTime(formatTime(currentTime));

        } else {
          // Resume playback
          await soundRef.current.playAsync();
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
          <Text style={styles.text}>{isPlaying ? 'Pause' : playText}</Text> 
        )}
      </TouchableOpacity>


      {rewardTime !== null && (
        <Text style={styles.reward}>
          Saved reward time: {rewardTime}
        </Text>
        )}

      {soundRef.current && (
        <>
        <Slider
            style={styles.slider}
            value={(currentTime)}
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor="#000"
            maximumTrackTintColor="#555"
            thumbTintColor="#000"
            onSlidingComplete={async (value) => {
              if (soundRef.current) {
                await soundRef.current.setPositionAsync(value);
              }
            }}
          />

        <Text style={styles.timer}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
        </>
      )}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    //alignItems: 'center',
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
    backgroundColor: '#555', //ich hier farbe geändert
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  reward: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left', //here to left
  },
  timer: {
    fontSize: 14,
    color: '#555',
    paddingBottom: 30,
    textAlign: 'right', //here to right
    marginTop: -10,
  },
  slider: {
    height: 40,
    width: '100%',
  },
});

export default AudioButtonTry;