import mongoose from "mongoose";

// Schema per i commenti
const commentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    _id: true, // Ogni commento ha un proprio _id univoco
  }
);

// Schema per i post del blog
const blogPostSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    author: { type: String, },
    content: { type: String, required: true },
    comments: [commentSchema], // Array di commenti, incorporato
  },
  {
    timestamps: true,
    collection: "blogPosts", // Nome della collezione nel database
  }
);

export default mongoose.model("BlogPost", blogPostSchema);
