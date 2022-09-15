import Link from 'next/link';
import { useRouter } from 'next/router';
import conectarDB from '../../lib/dbConnect';
import Movie from '../../models/movie';

function MoviePage({ success, movie, error }) {
  const router = useRouter();

  if (!success) {
    return (
      <div className="container text-center my-5">
        <h3>{error} 😥</h3>
        <Link href="/">
          <a className="btn btn-success">Volver al inicio</a>
        </Link>
      </div>
    );
  }

  const deleteData = async (id) => {
    console.log(id);
    try {
      await fetch(`/api/movie/${id}`, {
        method: 'DELETE',
      });
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container my-5">
      <h1>Detalle de la película</h1>
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <h5 className="text-uppercase">{movie.title}</h5>
          </div>
          <p className="fw-light">{movie.plot}</p>
          <Link href="/">
            <a className="btn btn-primary btn-sm">Volver...</a>
          </Link>
          <Link href={`/${movie._id}/edit`}>
            <a className="btn btn-warning btn-sm mx-2">Editar</a>
          </Link>
          <button className="btn btn-danger btn-sm" onClick={() => deleteData(movie._id)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MoviePage;

export async function getServerSideProps({ params }) {
  console.log(params.id);
  try {
    await conectarDB();
    // https://mongoosejs.com/docs/tutorials/lean.html
    const movie = await Movie.findById(params.id).lean();

    if (!movie) {
      return {
        props: {
          success: false,
          error: 'Pelicula no encontrada',
        },
      };
    }

    movie._id = movie._id.toString();

    return {
      props: {
        success: true,
        movie: movie,
      },
    };
  } catch (error) {
    let message = '';
    if (error.kind === 'ObjectId') {
      message = 'Formato de id no valido';
      return {
        props: {
          success: false,
          error: message,
        },
      };
    }
    message = 'error de servidor';
    return {
      props: {
        success: false,
        error: message,
      },
    };
  }
}
