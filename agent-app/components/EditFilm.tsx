import { Film } from "interfaces/models"; 
import React, { useState } from "react";
import { YStack, Button, Input, Text } from "tamagui";

const EditFilmModal = ({
  film,
  onSave,
  onClose,
}: {
  film: Film;
  onSave: (film: Film) => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(film.title);
  const [director, setDirector] = useState(film.director);
  const [date, setReleaseDate] = useState(film.date);
  const [duration, setDuration] = useState(film.duration);

  const handleSave = () => {
    const updatedFilm: Film = {
      ...film,
      title,
      director,
      date,
      duration,
    };

    fetch(`http://192.168.18.63:8082/films/${film.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFilm),
    })
    .then((response) => response.json())
    .then((data) => {
      onSave(data);
    })
    .catch((error) => {
      console.error("Error updating film:", error);
    });
  };

  return (
    <YStack space="$4" padding="$4" borderRadius="$4" backgroundColor="#fff">
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Edit Film</Text>
      <Input placeholder="Title" value={title} onChangeText={setTitle} />
      <Input placeholder="Director" value={director} onChangeText={setDirector} />
      <Input placeholder="Release Date" value={date} onChangeText={setReleaseDate} />
      <Input placeholder="Duration" value={String(duration)} onChangeText={(text) => setDuration(Number(text))} />
      <Button onPress={handleSave}>Save</Button>
      <Button onPress={onClose}>Cancel</Button>
    </YStack>
  );
};

export default EditFilmModal;
