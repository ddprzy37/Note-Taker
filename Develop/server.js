// Import necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

// Create an instance of Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies of requests
app.use(express.json());

// Routes

// Serve the index.html file when the root path is accessed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Serve the notes.html file when the '/notes' path is accessed
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Add a GET route for the API to get rendered notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await getNotes();
    console.log(notes);
    res.json(notes);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Read existing notes from the 'db.json' file
function readDb() {
  return readFileAsync('./db/db.json', 'utf8');
}

// Function to get notes asynchronously
const getNotes = async () => {
  try {
    const notesData = await readDb();
    const parsedNotes = [].concat(JSON.parse(notesData));
    return parsedNotes;
  } catch (error) {
    throw error;
  }
};

// Write notes to the 'db.json' file
const saveNotes = (notes) => {
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
};

// Create a new note
app.post('/api/notes', async (req, res) => {
  const newNote = req.body;
  try {
    let notes = await getNotes(); // Wait for getNotes() to resolve
    newNote.id = Date.now().toString(); // Assign a unique ID to the new note
    notes.push(newNote);
    saveNotes(notes);
    res.json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new note' });
  }
});

// Delete a note by ID
app.delete('/api/notes/:id', async (req, res) => {
  const noteId = req.params.id;
  try {
    let notes = await getNotes(); // Wait for getNotes() to resolve
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    saveNotes(updatedNotes);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the note' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//starting a routes folder where i put in my apiRoutes in order to comfortable handle the ammount of data