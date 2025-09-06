
import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";


const isElectron = typeof window !== "undefined" && !!window.electronAPI;

async function openExternal(url: string) {
  
  if (isElectron && window.electronAPI && window.electronAPI.openExternal) {
    window.electronAPI.openExternal(url);
  } else {
    Linking.openURL(url);
  }
}

export default function Hello() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    
    if (isElectron && window.electronAPI && window.electronAPI.greet) {
      const msg = await window.electronAPI.greet(name);
      setGreetMsg(msg);
    } else {
      setGreetMsg("Electron API is only available in the desktop app.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Expo + Electron</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() =>  openExternal("https://expo.dev")}>
          <Image source={require("../assets/images/expo-logo.png")} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openExternal("https://electronjs.org")}>
          <Image source={require("../assets/images/electron-logo.svg")} style={styles.logo} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Click on the Expo and Electron names to learn more.</Text>
      <View style={styles.formRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a name..."
          value={name}
          onChangeText={setName}
        />
        <Button title="Greet" onPress={greet} />
      </View>
      <Text style={styles.greetMsg}>{greetMsg}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 48,
    height: 48,
    margin: 8,
  },
  link: {
    color: "#007aff",
    fontWeight: "bold",
    fontSize: 18,
    marginHorizontal: 8,
    textDecorationLine: "underline",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    minWidth: 180,
  },
  greetMsg: {
    fontSize: 18,
    color: "#333",
    marginBottom: 16,
  },
  info: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 24,
  },
});
