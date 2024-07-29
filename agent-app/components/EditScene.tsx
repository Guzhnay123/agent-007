import React, { useState } from "react";
import { Scene } from "interfaces/models";
import { YStack, Button, Input, Text } from "tamagui";

const EditScene = ({
  scene,
  onSave,
  onClose,
}: {
  scene: Scene;
  onSave: (scene: Scene) => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(scene.title);
  const [description, setDescription] = useState(scene.description);
  const [location, setLocation] = useState(scene.location);
  const [minutes, setMinutes] = useState(scene.minutes);

  const handleSave = async () => {
    const updatedScene = { ...scene, title, description, location, minutes };
    try {
      const response = await fetch(`http://192.168.18.63:8082/scene/${scene.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedScene),
      });
      const data = await response.json();
      onSave(data);
      onClose();
    } catch (error) {
      console.error("Error updating scene:", error);
    }
  };

  return (
    <YStack space="$4" padding="$4" borderRadius="$4" backgroundColor="#fff">
      <Text>Edit Scene</Text>
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

export default EditScene;
