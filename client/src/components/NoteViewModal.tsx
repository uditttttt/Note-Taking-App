import React from 'react';

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NoteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

const NoteViewModal: React.FC<NoteViewModalProps> = ({ isOpen, onClose, note }) => {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-2 break-words">{note.title}</h2>
        <p className="text-gray-700 whitespace-pre-wrap break-words">{note.content}</p>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteViewModal;