import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import CreateNoteModal from '../components/CreateNoteModal';
import NoteViewModal from '../components/NoteViewModal';

// Note Type Definition
interface Note {
  _id: string;
  title: string;
  content: string;
}

const Logo: React.FC = () => (
    <div className="flex items-center space-x-2">
      <img src="/assets/your-logo-filename.png" alt="HD Logo" className="w-7 h-7" />
      <span className="text-xl font-bold text-black">Dashboard</span>
    </div>
  );
  
const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-red-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.91 2.75 6 3.704 6 4.874v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const DashboardPage: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchNotes();
    }
  }, [token, navigate, fetchNotes]);

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setIsViewModalOpen(true);
  };

  const handleLogout = () => { 
    logout(); 
    navigate('/'); 
  };

  const handleCreateNote = async (title: string, content: string) => {
    try {
      await api.post('/notes', { title, content });
      setIsCreateModalOpen(false);
      fetchNotes();
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateNote}
      />
      <NoteViewModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        note={selectedNote}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
          <header className="flex items-center justify-between py-4">
            <Logo />
            <button onClick={handleLogout} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
              Sign Out
            </button>
          </header>

          <main className="mt-6 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}!</h1>
              <p className="text-gray-600 mt-1">Email: {user.email}</p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none"
            >
              Create Note
            </button>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
              <div className="space-y-4">
                {notes.length > 0 ? (
                  notes.map(note => (
                    <div key={note._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                      <div className="cursor-pointer flex-1" onClick={() => handleViewNote(note)}>
                        <h3 className="font-bold text-gray-800 break-words">{note.title}</h3>
                        {/* Note content is removed from here */}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id); }} className="ml-4 flex-shrink-0">
                        <TrashIcon />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">You have no notes yet. Create one!</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;