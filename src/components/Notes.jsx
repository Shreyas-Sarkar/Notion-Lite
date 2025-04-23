import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_PB_URL);

const Notes = ({ notes, setNotes }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [selectedTag, setSelectedTag] = useState('work');

  useEffect(() => {
    if (!notes) {
      fetchNotes();
    } else {
      setLoading(false);
    }
  }, [notes]);

  const fetchNotes = async () => {
    try {
      if (!pb.authStore.isValid) {
        setError('Please log in to view notes');
        return;
      }
      const records = await pb.collection('notes').getFullList({
        sort: '-created',
        expand: 'user',
        filter: `user = "${pb.authStore.model.id}"`
      });
      setNotes(records);
      setError('');
    } catch (err) {
      setError(`Failed to fetch notes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    setError('');
    if (!newNote.title.trim() || !newNote.content.trim()) {
      setError('Title and content cannot be empty');
      return;
    }
    if (!pb.authStore.isValid) {
      setError('Please log in to create notes');
      return;
    }
    try {
      const data = {
        title: newNote.title,
        content: newNote.content,
        tags: selectedTag,
        user: pb.authStore.model.id
      };
      console.log("Creating note with:", data);

      await pb.collection('notes').create(data);
      setNewNote({ title: '', content: '' });
      await fetchNotes();
    } catch (err) {
      setError(`Failed to create note: ${err.message}`);
    }
  };

  const handleDeleteNote = async (id) => {
    setError('');
    if (!pb.authStore.isValid) {
      setError('Please log in to delete notes');
      return;
    }
    try {
      await pb.collection('notes').delete(id);
      await fetchNotes();
    } catch (err) {
      setError(`Failed to delete note: ${err.message}`);
    }
  };

  return (
    <div className="notes-container">
      <h2>Notes</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="notes-input">
            <div className="notes-form">
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Note title..."
                className="note-title-input"
              />
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Write a new note..."
                onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && handleAddNote()}
              />
              <div className="tag-selector">
                <label>
                  <input
                    type="radio"
                    value="work"
                    checked={selectedTag === 'work'}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  />
                  <span className="tag work">Work</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="personal"
                    checked={selectedTag === 'personal'}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  />
                  <span className="tag personal">Personal</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="others"
                    checked={selectedTag === 'others'}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  />
                  <span className="tag others">Others</span>
                </label>
              </div>
              <button 
                onClick={handleAddNote}
                disabled={!newNote.title.trim() || !newNote.content.trim()}
              >
                Add Note
              </button>
            </div>
          </div>
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className="note-item">
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <div className="note-meta">
                    <span className={`tag ${note.tags}`}>{note.tags}</span>
                    <small className="note-timestamp">Created: {new Date(note.created).toLocaleString()}</small>
                  </div>
                </div>
                <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Notes;