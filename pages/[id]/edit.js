import Form from '../../components/Form';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';

//Esto es swr
const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('Ocurrió un error mientras se hacie el fetch');
    error.info = await res.json();
    error.status = res.status;
    console.log(error.message);

    throw error;
  }
  const { data } = await res.json();
  return data;
};

function EditMovie() {
  const router = useRouter();
  const { id } = router.query;

  // console.log(router);
  // console.log(id);

  const { data, error } = useSWR(id ? `/api/movie/${id}` : null, fetcher);

  if (error) {
    return (
      <div className="container mt-5 text-cenr">
        <h1>{error.message}</h1>
        <Link href="/">
          <a>Volver...</a>
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mt-5 text-cenr">
        <h1>LOADING...</h1>
      </div>
    );
  }
  console.log(data);
  const formData = {
    title: data.title,
    plot: data.plot,
    id: data._id,
  };

  return (
    <div className="container my-5">
      <h1>Editar Movie</h1>
      <Form formNewMovie={false} formData={formData} />
    </div>
  );
}

export default EditMovie;
