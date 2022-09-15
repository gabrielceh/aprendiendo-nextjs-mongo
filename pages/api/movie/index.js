// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import conectarDB from '../../../lib/dbConnect';
import Movie from '../../../models/movie';

export default async function handler(req, res) {
  await conectarDB();
  //POST
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        console.log(req.body);
        const movie = new Movie(req.body);
        const newMovie = await movie.save();

        return res.status(200).json({ success: true, newMovie });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: error });
      }
    default:
      return res.status(500).json({ success: false, error: 'Método no válido' });
  }
}
