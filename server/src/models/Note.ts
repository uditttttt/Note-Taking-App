import { model, Schema, Document, Types } from 'mongoose';

// Define an interface for the Note document
export interface INote extends Document {
  title: string;
  content: string;
  user: Types.ObjectId; // Reference to the User who owns the note
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This creates the relationship to the User model
    required: true,
  },
}, { timestamps: true });

export default model<INote>('Note', noteSchema);