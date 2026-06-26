import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchConAuth from "../utils/fetchConAuth";
import { fetchPedidos, selectPedidos, selectPedidosLoading } from "../store/pedidosSlice";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const pedidos = useSelector(selectPedidos);
  const pedidosLoading = useSelector(selectPedidosLoading);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchConAuth("http://localhost:8080/api/usuarios/perfil");
        if (!response.ok) throw new Error("Error al cargar el perfil");
        setProfile(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    if (pedidos.length === 0) dispatch(fetchPedidos());
  }, [dispatch]);

  if (loading) return <div>Cargando perfil...</div>;
  if (error)   return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth:"600px", margin:"2rem auto", padding:"2rem",
                  border:"1px solid #ddd", borderRadius:"8px" }}>
      <h1>Mi Perfil</h1>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
        <p><strong>Nombre:</strong> {profile?.nombre}</p>
        <p><strong>Apellido:</strong> {profile?.apellido}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
      </div>

      <hr style={{ margin:"2rem 0" }} />

      <h2>Mis Recetas Compradas</h2>
      {pedidosLoading ? (
        <p>Cargando compras...</p>
      ) : pedidos.length === 0 ? (
        <p style={{ color:"#666" }}>Aún no adquiriste ninguna receta.</p>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {pedidos.map(pedido => (
            <div key={pedido.id}
                style={{ padding:"12px", border:"1px solid #eee",
                          borderRadius:"6px", background:"#f9f9f9" }}>
              <strong>Pedido #{pedido.id}</strong>
              <span style={{ marginLeft:"12px", color:"#666" }}>
                {pedido.fecha} — ${Number(pedido.total ?? 0).toLocaleString("es-AR")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
