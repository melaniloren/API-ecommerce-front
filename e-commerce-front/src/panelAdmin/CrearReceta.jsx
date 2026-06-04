import { useEffect, useState } from "react";
import fetchConAuth from "../utils/fetchConAuth";

const buildInitialForm = (recetaEditar) => ({
  nombre: recetaEditar?.nombre ?? "",
  descripcion: recetaEditar?.descripcion ?? "",
  precio: recetaEditar?.precio ?? "",
  categoriaId: recetaEditar?.categorias?.[0]?.idCategoria ?? "",
});

function CrearReceta({
  onRecetaCreada,
  onCancelar,
  recetaEditar,
  categories,
  products,
  initialProductIds = [],
  onSaveRecipeProducts,
}) {
  const esEdicion = Boolean(recetaEditar);
  const [formData, setFormData] = useState(buildInitialForm(recetaEditar));
  const [selectedProductIds, setSelectedProductIds] = useState(initialProductIds);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setFormData(buildInitialForm(recetaEditar));
    setSelectedProductIds(initialProductIds);
  }, [initialProductIds, recetaEditar]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleProduct = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(String(productId))
        ? prev.filter((id) => id !== String(productId))
        : [...prev, String(productId)],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCargando(true);

    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categorias: formData.categoriaId ? [parseInt(formData.categoriaId, 10)] : [],
      };

      const response = await fetchConAuth(
        esEdicion
          ? `http://localhost:8080/api/recetas/${recetaEditar.id}`
          : "http://localhost:8080/api/recetas",
        {
          method: esEdicion ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(esEdicion ? "Error al actualizar receta" : "Error al crear receta");
      }

      const savedRecipe = await response.json();

      if (onSaveRecipeProducts) {
        await onSaveRecipeProducts(savedRecipe.id, selectedProductIds);
      }

      onRecetaCreada?.(savedRecipe);
      setFormData(buildInitialForm(null));
      setSelectedProductIds([]);
    } catch (error) {
      alert(error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="admin-modal-card">
      <div className="admin-card-heading">
        <div>
          <p className="section-kicker">{esEdicion ? "Editar receta" : "Nueva receta"}</p>
          <h2>{esEdicion ? "Actualizar receta" : "Agregar receta"}</h2>
        </div>
        <p>Completa los datos basicos y elegi los productos que la componen.</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descripcion
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </label>

        <div className="admin-form-grid">
          <label>
            Precio
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </label>

          <label>
            Categoria
            <select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar categoria</option>
              {categories.map((category) => (
                <option key={category.idCategoria} value={category.idCategoria}>
                  {category.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="admin-products-picker">
          <div className="admin-products-picker-heading">
            <strong>Productos vinculados</strong>
            <span>{selectedProductIds.length} seleccionados</span>
          </div>

          {products.length === 0 ? (
            <div className="catalog-empty">
              Primero carga productos en el panel para poder asociarlos a la receta.
            </div>
          ) : (
            <div className="admin-chip-grid">
              {products.map((product) => {
                const active = selectedProductIds.includes(String(product.id));

                return (
                  <button
                    className={active ? "admin-chip active" : "admin-chip"}
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                  >
                    <span>{product.nombre}</span>
                    {product.stock !== undefined && <small>Stock: {product.stock}</small>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="admin-form-actions">
          <button className="admin-primary-button" type="submit" disabled={cargando}>
            {cargando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear receta"}
          </button>
          <button className="admin-secondary-button" type="button" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearReceta;
