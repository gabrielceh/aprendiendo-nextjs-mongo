import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Form = ({ formData, formNewMovie = true }) => {
  const [form, setForm] = useState({
    title: formData.title,
    plot: formData.plot,
  });
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setMessage([]);
    const { value, name } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const postData = async (form) => {
    try {
      setLoading(true);
      console.log(form);
      const res = await fetch('/api/movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      if (!data.success) {
        setMessage([]);
        for (const key in data.error.errors) {
          let error = data.error.errors[key];
          setMessage((oldMessage) => [...oldMessage, { message: error.message }]);
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const putData = async (form) => {
    const { id } = router.query;
    try {
      setLoading(true);
      console.log(form);
      const res = await fetch(`/api/movie/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      if (!data.success) {
        setMessage([]);
        console.log(data.error);
        for (const key in data.error.errors) {
          let error = data.error.errors[key];
          setMessage((oldMessage) => [...oldMessage, { message: error.message }]);
        }
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formNewMovie) {
      postData(form);
    } else {
      putData(form);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control my-2"
        name="title"
        placeholder="Title"
        autoComplete="off"
        value={form.title}
        onChange={handleChange}
      />
      <input
        type="text"
        className="form-control my-2"
        name="plot"
        placeholder="Plot"
        autoComplete="off"
        value={form.plot}
        onChange={handleChange}
      />
      <button className="btn btn-primary w-100 my-2" type="submit">
        {loading ? 'Cargando...' : formNewMovie ? 'Agregar' : 'Editar'}
      </button>
      <Link href="/">
        <a className="btn btn-warning w-100 my-2">Volver</a>
      </Link>
      {message.map(({ message }) => (
        <p key={message} className="text-danger">
          {message}
        </p>
      ))}
    </form>
  );
};

export default Form;
