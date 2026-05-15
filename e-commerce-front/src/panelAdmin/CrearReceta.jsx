import React, { useState, useEffect } from 'react';

const CrearReceta = ({ onRecetaCreada, onCancelar }) => {

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {

      const response = await fetch(
        'http://localhost:8080/api/categorias'
      );

      if (!response.ok) {
        throw new Error('Error cargando categorías');
      }

      const data = await response.json();

      console.log('Categorias:', data);

      setCategorias(data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setCargando(true);

    try {

      // IMPORTANTE:
      // Ajustado para Spring Boot

      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),

        // Si tu DTO espera lista
        categoriasIds: [
          parseInt(formData.categoriaId)
        ]
      };

      console.log('Payload enviado:', payload);

      const response = await fetch(
        'http://localhost:8080/api/recetas',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {

        const errorText = await response.text();

        console.error(errorText);

        throw new Error(
          'Error al crear receta'
        );
      }

      const nuevaReceta = await response.json();

      console.log('Receta creada:', nuevaReceta);

      alert('Receta creada correctamente');

      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoriaId: ''
      });

      if (onRecetaCreada) {
        onRecetaCreada(nuevaReceta);
      }

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setCargando(false);
    }
  };

  return (

    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '450px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}
    >

      <h2 style={{ marginTop: 0 }}>
        Nueva Receta
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >

        <div>
          <label>Nombre</label>

          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label>Descripción</label>

          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            style={{
              ...inputStyle,
              height: '90px',
              resize: 'vertical'
            }}
          />
        </div>

        <div>
          <label>Precio</label>

          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={inputStyle}
          />
        </div>

        <div>
          <label>Categoría</label>

          <select
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleChange}
            required
            style={inputStyle}
          >

            <option value="">
              Seleccionar categoría
            </option>

            {categorias.map((cat) => (

              <option
                key={cat.id}
                value={cat.id}
              >
                {cat.nombre}
              </option>

            ))}

          </select>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '10px'
          }}
        >

          <button
            type="submit"
            disabled={cargando}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {cargando
              ? 'Guardando...'
              : 'Guardar'}
          </button>

          <button
            type="button"
            onClick={onCancelar}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#6c757d',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '4px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  boxSizing: 'border-box'
};

export default CrearReceta;