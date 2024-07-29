import React, { useState } from "react";
import { Character } from "interfaces/models";
import { YStack, Input, Button, Text } from "tamagui";

const AddCharacter = ({
  sceneId,
  onSave,
  onClose,
}: {
  sceneId: number;
  onSave: (character: Character) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [actor, setActor] = useState("");
  const handleSave = async () => {
    try {
      const response = await fetch("http://192.168.18.63:8082/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          role,
          actor,
          sceneId, // Asegúrate de incluir el sceneId
        }),
      });
      const newCharacter: Character = await response.json();
      onSave(newCharacter);
      onClose();
    } catch (error) {
      console.error("Error adding character:", error);
    }
  };

  return (
    <YStack space="$4" padding="$4" borderRadius="$4" backgroundColor="#07EE3F">
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
        Add Character
      </Text>
      <Input value={name} onChangeText={setName} placeholder="Name" />
      <Input value={role} onChangeText={setRole} placeholder="Role" />
      <Input value={actor} onChangeText={setActor} placeholder="Actor" />

      <Button onPress={handleSave}>Save</Button>
      <Button onPress={onClose}>Cancel</Button>
    </YStack>
  );
};

export default AddCharacter;
