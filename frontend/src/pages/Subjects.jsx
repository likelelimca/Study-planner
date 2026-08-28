import { useEffect, useState } from "react";
import { Box, Heading, Input, Button, Stack, HStack, Text, IconButton, Textarea } from "@chakra-ui/react";
import { LuTrash2, LuPencil } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import IndexCard from "@/components/IndexCard";
import { api } from "@/api";
import { colors } from "@/theme";
import { notifyError, notifySuccess } from "@/utils/notify";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadSubjects = () => {
    api.getSubjects().then(setSubjects).catch((err) => notifyError(err.message));
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateSubject(editingId, { name, description });
        notifySuccess("Subject updated");
      } else {
        await api.createSubject({ name, description });
        notifySuccess("Subject added");
      }
      setName("");
      setDescription("");
      setEditingId(null);
      loadSubjects();
    } catch (err) {
      notifyError(err.message);
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
      notifySuccess("Subject deleted");
      loadSubjects();
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <Box bg={colors.paper} minH="100vh">
      <Navbar />
      <Box p={{ base: 5, md: 8 }} maxW="700px" mx="auto">
        <Heading className="font-display" mb={7} color={colors.ink}>Subjects</Heading>

        <form onSubmit={handleSubmit}>
          <Stack gap={3} mb={10} p={5} bg="white" borderWidth="1px" borderColor={colors.line} borderRadius="4px">
            <Input placeholder="Subject name" value={name} onChange={(e) => setName(e.target.value)} required
              borderColor={colors.line} borderRadius="4px" />
            <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)}
              borderColor={colors.line} borderRadius="4px" />
            <HStack>
              <Button type="submit" bg={colors.ink} color={colors.paper} _hover={{ bg: "#233863" }} borderRadius="4px">
                {editingId ? "Update subject" : "Add subject"}
              </Button>
              {editingId && (
                <Button variant="ghost" color={colors.inkSoft} onClick={() => { setEditingId(null); setName(""); setDescription(""); }}>
                  Cancel
                </Button>
              )}
            </HStack>
          </Stack>
        </form>

        <Stack gap={3}>
          {subjects.length === 0 && <Text color={colors.inkSoft}>No subjects yet — add one above.</Text>}
          {subjects.map((subject) => (
            <IndexCard key={subject._id} tabColor={colors.ink}>
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="600" color={colors.ink}>{subject.name}</Text>
                  {subject.description && <Text fontSize="sm" color={colors.inkSoft}>{subject.description}</Text>}
                </Box>
                <HStack>
                  <IconButton aria-label="Edit" size="sm" variant="ghost" color={colors.inkSoft} onClick={() => handleEdit(subject)}>
                    <LuPencil />
                  </IconButton>
                  <IconButton aria-label="Delete" size="sm" variant="ghost" color={colors.clay} onClick={() => handleDelete(subject._id)}>
                    <LuTrash2 />
                  </IconButton>
                </HStack>
              </HStack>
            </IndexCard>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
