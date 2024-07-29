import React, { useState } from "react";
import { Character } from "interfaces/models";
import { YStack, Button, Input, Text } from "tamagui";

const EditCharacter = ({
  character,
  onSave,
  onClose,
}: {
  character: Character;
  onSave: (character: Character) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(character.name);
  const [role, setRole] = useState(character.role);
  const [actor, setActor] = useState(character.actor);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://192.168.18.63:8082/characters/${character.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          role,
          actor,
        }),
      });
      const updatedCharacter: Character = await response.json();
      onSave(updatedCharacter);
    } catch (error) {
      console.error("Error updating character:", error);
    }
  };

  return (
    <YStack space="$4" padding="$4" borderRadius="$4" backgroundColor="#fff">
      <Text>Edit Character</Text>
      <Input value={name} onChangeText={setName} placeholder="Name" />
      <Input value={role} onChangeText={setRole} placeholder="Role" />
      <Input value={actor} onChangeText={setActor} placeholder="Actor" />

      <Button onPress={handleSave}>Save</Button>
      <Button onPress={onClose}>Cancel</Button>
    </YStack>
  );
};

export default EditCharacter;
