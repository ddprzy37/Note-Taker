// Import necessary modules
const express = require('express');
const path = require('path');
const fs = require('fs');

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

// need to add a get route for the api to get rendered
app.get('/api/notes', (req, res) => {
    const notesData = getNotes()
    return res.json(notesData);
})


// Read existing notes from the 'db.json' file
const getNotes = () => {
  const notesData = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8');
  console.log(notesData);
  return JSON.parse(notesData);
};

// Write notes to the 'db.json' file
const saveNotes = (notes) => {
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
};

// Create a new note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = getNotes();
  newNote.id = Date.now().toString(); // Assign a unique ID to the new note
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

// Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const notes = getNotes();
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  saveNotes(updatedNotes);
  res.sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//starting a routes folder where i put in my apiRoutes in order to comfortable handle the ammount of data