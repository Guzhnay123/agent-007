import { Film } from "interfaces/models"; 
import React, { useState } from "react";
import { YStack, Button, Input, Text } from "tamagui";

const AddFilmModal = ({
  onSave,
  onClose,
}: {
  onSave: (film: Film) => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = React.useState("");
  const [director, setDirector] = React.useState("");
  const [date, setReleaseDate] = React.useState("");
  const [duration, setDuration] = React.useState(0);

  const handleSave = () => {
    const newFilm: Film = {
      id: Date.now(),  // Esto se reemplazará por el id generado por el backend
      title,
      director,
      date,
      duration,
    };

    fetch("http://192.168.18.63:8082/films", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFilm),
    })
    .then((response) => response.json())
    .then((data) => {
      onSave(data);
    })
    .catch((error) => {
      console.error("Error adding film:", error);
    });
  };

  return (
    <YStack space="$4" padding="$4" borderRadius="$4" backgroundColor="#fff">
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add Film</Text>
      <Input placeholder="Title" value={title} onChangeText={setTitle} />
      <Input placeholder="Director" value={director} onChangeText={setDirector} />
      <Input placeholder="Release Date" value={date} onChangeText={setReleaseDate} />
      <Input placeholder="Duration" value={String(duration)} onChangeText={(text) => setDuration(Number(text))} />
      <Button onPress={handleSave}>Save</Button>
      <Button onPress={onClose}>Cancel</Button>
    </YStack>
  );
};

export default AddFilmModal;
