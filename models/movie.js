import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: '{PATH} es requerido',
  },
  plot: {
    type: String,
    required: '{PATH} es requerido',
  },
});

export default mongoose.models.Movie || mongoose.model('Movie', MovieSchema);
