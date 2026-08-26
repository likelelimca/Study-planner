import { useEffect, useState } from "react";
import { Box, Heading, Input, Button, Stack, HStack, Text, IconButton, Textarea } from "@chakra-ui/react";
import { LuTrash2, LuPencil } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import { api } from "@/api";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadSubjects = () => {
    api.getSubjects().then(setSubjects).catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.updateSubject(editingId, { name, description });
      } else {
        await api.createSubject({ name, description });
      }
      setName("");
      setDescription("");
      setEditingId(null);
      loadSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject._id);
    setName(subject.name);
    setDescription(subject.description || "");
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteSubject(id);
      loadSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box p={8} maxW="700px" mx="auto">
        <Heading mb={6}>Subjects</Heading>

        <form onSubmit={handleSubmit}>
          <Stack gap={3} mb={8} p={5} borderWidth={1} borderRadius="lg">
            <Input placeholder="Subject name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            {error && <Text color="red.500" fontSize="sm">{error}</Text>}
            <HStack>
              <Button type="submit" colorPalette="teal">{editingId ? "Update Subject" : "Add Subject"}</Button>
              {editingId && (
                <Button variant="ghost" onClick={() => { setEditingId(null); setName(""); setDescription(""); }}>
                  Cancel
                </Button>
              )}
            </HStack>
          </Stack>
        </form>

        <Stack gap={3}>
          {subjects.length === 0 && <Text color="gray.500">No subjects yet — add one above.</Text>}
          {subjects.map((subject) => (
            <HStack key={subject._id} p={4} borderWidth={1} borderRadius="md" justify="space-between">
              <Box>
                <Text fontWeight="bold">{subject.name}</Text>
                {subject.description && <Text fontSize="sm" color="gray.500">{subject.description}</Text>}
              </Box>
              <HStack>
                <IconButton aria-label="Edit" size="sm" variant="ghost" onClick={() => handleEdit(subject)}>
                  <LuPencil />
                </IconButton>
                <IconButton aria-label="Delete" size="sm" variant="ghost" colorPalette="red" onClick={() => handleDelete(subject._id)}>
                  <LuTrash2 />
                </IconButton>
              </HStack>
            </HStack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
