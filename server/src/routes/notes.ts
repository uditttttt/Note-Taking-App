import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Note, { INote } from '../models/Note';

const router = Router();

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      user: req.user?.id, // Get user ID from the middleware
    });

    const note = await newNote.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/notes
// @desc    Get all notes for a user
// @access  Private
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.user?.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const note: INote | null = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure the user owns the note
    if (note.user.toString() !== req.user?.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;