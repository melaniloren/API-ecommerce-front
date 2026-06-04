import { useState } from "react";

function AdminCategorias({
  categories,
  onSaveCategory,
  onDeleteCategory,
}) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleCreate = (event) => {
    event.preventDefault();
    onSaveCategory({ nombre: newCategoryName });
    setNewCategoryName("");
  };

  const startEditing = (category) => {
    setEditingId(category.idCategoria);
    setEditingName(category.nombre);
  };

  const submitEditing = (event) => {
    event.preventDefault();
    onSaveCategory({ idCategoria: editingId, nombre: editingName, source: "backend" });
    setEditingId(null);
    setEditingName("");
  };

  return (
    <section className="admin-section-grid">
      <article className="admin-card">
        <div className="admin-card-heading">
          <div>
            <p className="section-kicker">Panel de categorias</p>
            <h2>Editar categorias</h2>
          </div>
          <p>Podés renombrar las existentes y crear nuevas para organizar productos.</p>
        </div>

        <form className="admin-form" onSubmit={handleCreate}>
          <label>
            Nueva categoria
            <input
              type="text"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="Ej: Veganas"
              required
            />
          </label>

          <div className="admin-form-actions">
            <button className="admin-primary-button" type="submit">
              Agregar categoria
            </button>
          </div>
        </form>
      </article>

      <article className="admin-card">
        <div className="admin-card-heading">
          <div>
            <p className="section-kicker">Listado</p>
            <h2>Categorias disponibles</h2>
          </div>
          <p>{categories.length} categorias visibles en la app.</p>
        </div>

        <div className="admin-stack">
          {categories.map((category) => {
            const isEditing = String(editingId) === String(category.idCategoria);

            return (
              <article className="admin-item-card" key={category.idCategoria}>
                <div className="admin-item-main">
                  <div className="admin-item-meta">
                    <span>{category.source === "local" ? "Local" : "Catalogo"}</span>
                  </div>

                  {isEditing ? (
                    <form className="admin-inline-form" onSubmit={submitEditing}>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        required
                      />
                      <button type="submit">Guardar</button>
                      <button type="button" onClick={() => setEditingId(null)}>
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <>
                      <h3>{category.nombre}</h3>
                      <p>
                        {category.source === "local"
                          ? "Categoria creada desde el frontend."
                          : "Categoria sincronizada desde la API o renombrada localmente."}
                      </p>
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div className="admin-inline-actions">
                    <button type="button" onClick={() => startEditing(category)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => onDeleteCategory(category.idCategoria)}>
                      Eliminar
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </article>
    </section>
  );
}

export default AdminCategorias;
