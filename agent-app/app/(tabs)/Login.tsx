import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground } from "react-native";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "types/navigationTypes"; 
import { MaterialIcons } from "@expo/vector-icons";

type LoginNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<LoginNavigationProp>();

  const handleLogin = () => {
    if (username && password) {
      navigation.navigate("Dashboard", { id: 1 });
    } else {
      Alert.alert("Error", "Username or password");
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://example.com/your-image.jpg' }} // URL de tu imagen de fondo
      style={styles.background}
    >
      <View style={styles.container}>
        <MaterialIcons
          name="person-search"
          size={90}
          color="#07EE3F"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="##07EE3F"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7A0E4D"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Ingresar" onPress={handleLogin} color="#07EE3F" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Fondo semi-transparente blanco
  },
  icon: {
    marginBottom: 24,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#7A0E4D",
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#FFF",
    color: "#7A0E4D",
    fontSize: 16,
  },
});

export default Login;
