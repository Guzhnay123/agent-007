import React, { useState, useEffect } from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { YStack, Button } from "tamagui";
import { Pencil, Trash, Plus, Book, Delete } from "@tamagui/lucide-icons";
import EditFilmModal from "components/EditFilm";
import AddFilmModal from "components/AddFilm";
import { Film } from "interfaces/models";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "types/navigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";

type FilmDashboardNavigationProp = StackNavigationProp<RootStackParamList, "Scenes">;

const Dashboard = () => {
  const navigation = useNavigation<FilmDashboardNavigationProp>();
  const [editingFilm, setEditingFilm] = React.useState<Film | null>(null);
  const [addingFilm, setAddingFilm] = React.useState(false);
  const [films, setFilms] = useState<Film[]>([]);


  useEffect(() => {
    fetch("http://192.168.18.63:8082/films")
      .then((response) => response.json())
      .then((data) => setFilms(data))
      .catch((error) => console.error("Error fetching films:", error));
  }, []);

  
  const saveFilm = (updatedFilm: Film) => {
    setFilms(
      films.map((film) => (film.id === updatedFilm.id ? updatedFilm : film))
    );
  };

  const addFilm = (newFilm: Film) => {
    setFilms([...films, newFilm]);
  };

  // Delete film from backend
  const deleteFilm = (id: number) => {
    fetch(`http://192.168.18.63:8082/films/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setFilms(films.filter((film) => film.id !== id));
      })
      .catch((error) => console.error("Error deleting film:", error));
  };

  return (
    <ImageBackground
      source={{ uri: 'https://media.istockphoto.com/id/1290856356/es/foto/007-piz-gloria-schilthorn.jpg?s=1024x1024&w=is&k=20&c=g6IjDJbKQ3svCw4jCAZ7M03z01BcmoVfJgCGiF8j7v8=' }} // Aquí colocas la URL de la imagen
      style={styles.background}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {films.map((film) => (
            <TouchableOpacity
              key={film.id}
              onPress={() => navigation.navigate("Scenes", { id: film.id })}
            >
              <YStack
                space="$2"
                padding="$2"
                borderRadius="$2"
                backgroundColor="#07EE3F"
                marginBottom={8}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
                  {film.title}
                </Text>
                <Text style={{ color: "#fff" }}>{film.director}</Text>
                <Text style={{ color: "#fff" }}>{film.date}</Text>
                <Text style={{ color: "#fff" }}>{film.duration} min</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <Button
                    theme="alt2"
                    icon={Book}
                    onPressIn={() => setEditingFilm(film)}
                  />
                  <Button
                    theme="alt2"
                    icon={Delete}
                    onPressIn={() => deleteFilm(film.id)}
                  />
                </View>
              </YStack>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Button
          theme="alt2"
          icon={Plus}
          size="$4"
          position="absolute"
          bottom="$4"
          right="$4"
          onPress={() => setAddingFilm(true)}
        />

        {editingFilm && (
          <Modal
            transparent={true}
            visible={!!editingFilm}
            onRequestClose={() => setEditingFilm(null)}
          >
            <EditFilmModal
              film={editingFilm}
              onSave={saveFilm}
              onClose={() => setEditingFilm(null)}
            />
          </Modal>
        )}

        {addingFilm && (
          <Modal
            transparent={true}
            visible={addingFilm}
            onRequestClose={() => setAddingFilm(false)}
          >
            <AddFilmModal onSave={addFilm} onClose={() => setAddingFilm(false)} />
          </Modal>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default Dashboard;
