import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Extend the window.electronAPI type to include showDialog
declare global {
  interface Window {
    electronAPI?: {
      greet: (name: string) => Promise<string>;
      openExternal: (url: string) => void;
      showDialog?: (message: string) => Promise<string>;
    };
  }
}

export default function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Hello from Expo + Electron!');
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(window.electronAPI !== undefined);
  }, []);

  const handleElectronAction = async () => {
    if (window.electronAPI) {
      try {
        if (window.electronAPI?.showDialog) {
          const result = await window.electronAPI.showDialog('Hello from Expo!');
          console.log('Dialog result:', result);
        } else {
          console.warn('showDialog is not available on electronAPI');
        }
      } catch (error) {
        console.error('Error calling Electron API:', error);
      }
    } else {
      Alert.alert('Info', 'This feature only works in Electron desktop app');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <Text style={styles.title}>Expo + Electron Desktop App</Text>
      
      <View style={styles.card}>
        <Text style={styles.subtitle}>Counter Example</Text>
        <Text style={styles.counter}>{count}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.decrementButton]} 
            onPress={() => setCount(count - 1)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.incrementButton]} 
            onPress={() => setCount(count + 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Message Input</Text>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Enter a message..."
        />
        <Text style={styles.message}>{message}</Text>
      </View>

      {isElectron && (
        <View style={styles.card}>
          <Text style={styles.subtitle}>Electron Integration</Text>
          <TouchableOpacity 
            style={[styles.button, styles.electronButton]} 
            onPress={handleElectronAction}
          >
            <Text style={styles.buttonText}>Show Native Dialog</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.infoText}>
          This Expo app is running inside an Electron desktop container!
        </Text>
        <Text style={styles.infoText}>
          Platform: {navigator.platform}
        </Text>
        <Text style={styles.infoText}>
          Electron: {isElectron ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#555',
    textAlign: 'center',
  },
  counter: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 60,
  },
  incrementButton: {
    backgroundColor: '#28a745',
  },
  decrementButton: {
    backgroundColor: '#dc3545',
  },
  electronButton: {
    backgroundColor: '#6f42c1',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  info: {
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
  },
  infoText: {
    fontSize: 14,
    color: '#0066cc',
    textAlign: 'center',
    marginBottom: 5,
  },
});