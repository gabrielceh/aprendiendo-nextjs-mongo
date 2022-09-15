// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import conectarDB from '../../../lib/dbConnect';
import Movie from '../../../models/movie';

export default async function handler(req, res) {
  await conectarDB();

  //GET api/movie/:id --- BUSCA
  //DELETE api/movie/:id --- ELIMINA
  //PUT api/movie/:id --- EDITA
  const {
    method,
    query: { id },
  } = req;

  switch (method) {
    case 'GET':
      try {
        const movie = await Movie.findById(id).lean();

        if (!movie) {
          return res.status(400).json({ success: false });
        }

        return res.json({ success: true, data: movie });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false });
      }
    case 'PUT':
      try {
        const movie = await Movie.findByIdAndUpdate(id, req.body, {
          new: true, // devolverá el elemento actualizado
          runValidators: true, // hace que funcionen las validaciones del model
        });

        if (!movie) {
          return res.status(400).json({ success: false, error: 'No se encontró la pelicula' });
        }

        return res.json({ success: true, data: movie });
      } catch (error) {
        // console.log(error.errors);
        return res.status(400).json({ success: false, error });
      }
    case 'DELETE':
      try {
        const movie = await Movie.findByIdAndDelete(id);

        if (!movie) {
          return res.status(400).json({ success: false, error: 'No se encontró la pelicula' });
        }

        return res.json({ success: true, data: movie });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false });
      }
    default:
      return res.status(500).json({ success: false, error: 'Método no válido' });
  }
}
