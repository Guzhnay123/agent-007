import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Modal, StyleSheet, ImageBackground } from "react-native";
import { YStack, Button } from "tamagui";
import { Pencil, Trash, Plus } from "@tamagui/lucide-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Character, Scene } from "interfaces/models";
import EditCharacter from "components/EditCharacter";
import AddCharacter from "components/AddCharacter";
import { RootStackParamList } from "types/navigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";

type CharactersDashboardRouteProp = RouteProp<RootStackParamList, "Characters">;
type CharactersDashboardNavigationProp = StackNavigationProp<RootStackParamList, "Characters">;

const Characters = () => {
  const route = useRoute<CharactersDashboardRouteProp>();
  const { id } = route.params; // `id` es el `sceneId`
  const navigation = useNavigation<CharactersDashboardNavigationProp>();

  const [scene, setScene] = useState<Scene | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true); // Agregamos estado de carga
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [addingCharacter, setAddingCharacter] = useState(false);

  useEffect(() => {
    const fetchScene = async () => {
      try {
        const response = await fetch(`http://192.168.18.63:8082/scene/${id}`);
        const fetchedScene: Scene = await response.json();
        setScene(fetchedScene);
      } catch (error) {
        console.error("Error fetching scene:", error);
      }
    };

    fetchScene();
  }, [id]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(`http://192.168.18.63:8082/characters/scene/${id}`);
        const data: Character[] = await response.json();

        // Verifica que data sea un array antes de actualizar el estado
        if (Array.isArray(data)) {
          setCharacters(data);
        } else {
          console.error("Expected an array of characters, but received:", data);
          setCharacters([]); // Establece characters como un array vacío si la respuesta no es un array
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
        setCharacters([]); // En caso de error, establece characters como un array vacío
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchCharacters();
  }, [id]);

  const saveCharacter = (updatedCharacter: Character) => {
    setCharacters(
      characters.map((character) => (character.id === updatedCharacter.id ? updatedCharacter : character))
    );
  };

  const addCharacter = (newCharacter: Character) => {
    setCharacters([...characters, newCharacter]);
  };

  const deleteCharacter = (characterId: number) => {
    fetch(`http://192.168.18.63:8082/characters/${characterId}`, {
      method: "DELETE",
    })
      .then(() => {
        setCharacters(characters.filter((character) => character.id !== characterId));
      })
      .catch((error) => console.error("Error deleting character:", error));
  };

  if (loading) {
    return <View style={styles.loadingContainer}><Text style={styles.loadingText}>Cargando...</Text></View>;
  }

  return (
    <ImageBackground
      source={{ uri: 'https://media.istockphoto.com/id/954652654/es/foto/siluetas-de-soldados-en-misi%C3%B3n-militar-al-atardecer.jpg?s=1024x1024&w=is&k=20&c=sjMbxbErqyTxvNrhFkHVNREJq3GI3Yws9pm9WU4Mz88=' }} // URL de la imagen de fondo
      style={styles.background}
    >
      <YStack space="$4" padding="$4" flex={1}>
        {scene && (
          <Text style={styles.sceneTitle}>
            Scene ({scene.id})
          </Text>
        )}

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {characters.length === 0 ? (
            <View style={styles.noCharactersContainer}>
              <Text style={styles.noCharactersText}>No hay personajes disponibles. Agrega nuevos personajes.</Text>
            </View>
          ) : (
            characters.map((character) => (
              <YStack
                key={character.id}
                space="$2"
                padding="$2"
                borderRadius="$2"
                backgroundColor="#07EE3F"
                marginBottom={12}
              >
                <Text style={styles.characterName}>
                  {character.name}
                </Text>
                <Text style={styles.characterText}>{character.role}</Text>
                <Text style={styles.characterText}>{character.actor}</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    theme="alt2"
                    icon={Pencil}
                    onPress={() => setEditingCharacter(character)}
                  />
                  <Button
                    theme="alt2"
                    icon={Trash}
                    onPress={() => deleteCharacter(character.id)}
                  />
                </View>
              </YStack>
            ))
          )}
        </ScrollView>

        <Button
          theme="alt2"
          icon={Plus}
          size="$4"
          style={styles.addButton}
          onPress={() => setAddingCharacter(true)}
        />

        {editingCharacter && (
          <Modal
            transparent={true}
            visible={!!editingCharacter}
            onRequestClose={() => setEditingCharacter(null)}
          >
            <EditCharacter
              character={editingCharacter}
              onSave={saveCharacter}
              onClose={() => setEditingCharacter(null)}
            />
          </Modal>
        )}

        {addingCharacter && (
          <Modal
            transparent={true}
            visible={addingCharacter}
            onRequestClose={() => setAddingCharacter(false)}
          >
            <AddCharacter
              sceneId={id} // Pasa el `sceneId` al componente `AddCharacter`
              onSave={addCharacter}
              onClose={() => setAddingCharacter(false)}
            />
          </Modal>
        )}
      </YStack>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Ajusta la imagen de fondo
  },
  sceneTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  characterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  characterText: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
  },
  noCharactersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCharactersText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});

export default Characters;
