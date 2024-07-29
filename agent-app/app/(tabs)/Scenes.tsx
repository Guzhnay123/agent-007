import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Modal, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { YStack, Button, Spinner } from "tamagui";
import { Pencil, Trash, Plus } from "@tamagui/lucide-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Film, Scene } from "interfaces/models";
import EditScene from "components/EditScene"; 
import AddScene from "components/AddScene"; 
import { RootStackParamList } from "types/navigationTypes"; 
import { StackNavigationProp } from "@react-navigation/stack";

type ScenesDashboardRouteProp = RouteProp<
  RootStackParamList,
  "Scenes"
>;
type ScenesDashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Scenes"
>;

const Scenes = () => {
  const route = useRoute<ScenesDashboardRouteProp>();
  const navigation = useNavigation<ScenesDashboardNavigationProp>();
  const { id } = route.params;

  const [film, setFilm] = useState<Film | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [addingScene, setAddingScene] = useState(false);


  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(`http://192.168.18.63:8082/films/${id}`);
        const fetchedFilm: Film = await response.json();
        setFilm(fetchedFilm);
      } catch (error) {
        console.error("Error fetching film:", error);
      }
    };

    fetchFilm();
  }, [id]);

  useEffect(() => {
    const fetchScenes = async () => {
      try {
        const response = await fetch(`http://192.168.18.63:8082/scene/film/${id}`);
        const data: Scene[] = await response.json();

        if (Array.isArray(data)) {
          setScenes(data);
        } else {
          console.error("Expected an array of scenes, but received:", data);
          setScenes([]); 
        }
      } catch (error) {
        console.error("Error fetching scenes:", error);
        setScenes([]); 
      } finally {
        setLoading(false); 
      }
    };

    fetchScenes();
  }, [id]);
  const saveScene = (updatedScene: Scene) => {
    setScenes(
      scenes.map((scene) => (scene.id === updatedScene.id ? updatedScene : scene))
    );
  };

  const addScene = (newScene: Scene) => {
    setScenes([...scenes, newScene]);
  };

  const deleteScene = (id: number) => {
    fetch(`http://192.168.18.63:8082/scene/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setScenes(scenes.filter((scene) => scene.id !== id));
      })
      .catch((error) => console.error("Error deleting scene:", error));
  };

  if (loading) {
    return <Spinner size="large" />;
  }

  return (
    <ImageBackground
      source={{ uri: 'https://media.istockphoto.com/id/1131225679/es/foto/entrada-al-hotel-casino-royale-en-la-parte-central-de-strip-en-las-vegas-el-06-de-mayo-de-2009.jpg?s=1024x1024&w=is&k=20&c=qnYZtX6KRVMIk8VZajEcAGG-ZZfGq_VBf7Y1Fgz8Ozg=' }} // URL de la imagen de fondo
      style={styles.background}
    >
      <View style={{ flex: 1 }}>
        <YStack space="$4" padding="$4" style={{ flex: 1 }}>
          {film && (
            <>
              <Text style={styles.title}>
                FILM ({film.id})
              </Text>
            </>
          )}

          {scenes.length === 0 ? (
            <View style={styles.noScenesContainer}>
              <Text style={styles.noScenesText}>No hay escenas disponibles. Agrega nuevas escenas.</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollView}>
              {scenes.map((scene) => (
                <TouchableOpacity
                  key={scene.id}
                  onPress={() =>
                    navigation.navigate("Characters", {
                      id: scene.id,
                    })
                  }
                >
                  <YStack
                    space="$2"
                    padding="$2"
                    borderRadius="$2"
                    backgroundColor="#07EE3F"
                    marginBottom={12}
                  >
                    <Text style={styles.sceneTitle}>
                      {scene.title}
                    </Text>
                    <Text style={styles.sceneText}>{scene.description}</Text>
                    <Text style={styles.sceneText}>{scene.location}</Text>
                    <Text style={styles.sceneText}>{scene.minutes} min</Text>
                    <View style={styles.buttonContainer}>
                      <Button
                        theme="alt2"
                        icon={Pencil}
                        onPressIn={() => setEditingScene(scene)}
                      />
                      <Button
                        theme="alt2"
                        icon={Trash}
                        onPressIn={() => deleteScene(scene.id)}
                      />
                    </View>
                  </YStack>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Button
            theme="alt2"
            icon={Plus}
            size="$4"
            style={styles.addButton}
            onPress={() => setAddingScene(true)}
          />

          {editingScene && (
            <Modal
              transparent={true}
              visible={!!editingScene}
              onRequestClose={() => setEditingScene(null)}
            >
              <EditScene
                scene={editingScene}
                onSave={saveScene}
                onClose={() => setEditingScene(null)}
              />
            </Modal>
          )}

          {addingScene && (
            <Modal
              transparent={true}
              visible={addingScene}
              onRequestClose={() => setAddingScene(false)}
            >
              <AddScene
                filmId={id}
                onSave={addScene}
                onClose={() => setAddingScene(false)}
              />
            </Modal>
          )}
        </YStack>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
  },
  sceneTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  sceneText: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  noScenesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noScenesText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});

export default Scenes;
