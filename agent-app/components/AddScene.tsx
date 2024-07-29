import React, { useState } from "react";
import { Text } from "react-native";
import { Scene } from "interfaces/models";
import { YStack, Input, Button } from "tamagui";

const AddScene = ({
  filmId,
  onSave,
  onClose,
}: {
  filmId: number;
  onSave: (scene: Scene) => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [minutes, setMinutes] = useState(0);

  const handleSave = async () => {
    const newScene = { title, description, location, minutes, filmId };
    try {
      const response = await fetch(`http://192.168.18.63:8082/scene`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newScene),
      });
      const data = await response.json();
      onSave(data);
      onClose();
    } catch (error) {
      console.error("Error adding scene:", error);
    }
  };

  return (
    <YStack space="$4" padding="$4" borderRadius="$4" backgroundColor="#fff">
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
        Add Scene
      </Text>
      <Input value={title} onChangeText={setTitle} placeholder="Title" />
      <Input
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      <Input
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
      />
      <Input
        placeholder="Minutes"
        value={String(minutes)}
        onChangeText={(text) => setMinutes(Number(text))}
      />
      <Button onPress={handleSave}>
        Save
      </Button>
      <Button onPress={onClose}>Cancel</Button>
    </YStack>
  );
};

export default AddScene;
