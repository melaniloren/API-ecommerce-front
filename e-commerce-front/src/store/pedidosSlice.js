import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchConAuth from "../utils/fetchConAuth";

const API_BASE = "http://localhost:8080/api";

/*
// Obtiene el usuarioId desde GET /api/usuarios/perfil.
const fetchUsuarioId = async () => {
  const response = await fetchConAuth(`${API_BASE}/usuarios/perfil`);
  if (!response.ok) {
    throw new Error("No se pudo obtener el perfil del usuario");
  }
  const perfil = await response.json();
  return perfil.idUsuario;
};
*/
// Devuelve la fecha de hoy en formato YYYY-MM-DD.

const fechaHoy = () => new Date().toISOString().slice(0, 10);

// --- Thunks ----------------------------------------------------------------

// GET todos los pedidos y filtra por el usuario logueado (el backend no filtra).
export const fetchPedidos = createAsyncThunk(
  "pedidos/fetchPedidos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchConAuth(`${API_BASE}/pedidos/mis-pedidos`);
      if (!response.ok) throw new Error("No se pudieron obtener los pedidos");
      const pedidos = await response.json();
      return Array.isArray(pedidos) ? pedidos : [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST de un nuevo pedido con la fecha de hoy.
// El backend obtiene el usuarioId desde el token JWT en la cookie.
export const createPedido = createAsyncThunk(
  "pedidos/createPedido",
  async ({ total }, { rejectWithValue }) => {
    try {
      const response = await fetchConAuth(`${API_BASE}/pedidos`, {
        method: "POST",
        body: JSON.stringify({ fecha: fechaHoy(), total }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el pedido");
      }

      return response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// DELETE de un pedido por id (→ 204).
export const deletePedido = createAsyncThunk(
  "pedidos/deletePedido",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchConAuth(`${API_BASE}/pedidos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el pedido");
      }

      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// --- Slice -----------------------------------------------------------------

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const pedidosSlice = createSlice({
  name: "pedidos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const setRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error?.message ?? "Error desconocido";
    };

    builder
      // fetchPedidos
      .addCase(fetchPedidos.pending, setPending)
      .addCase(fetchPedidos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPedidos.rejected, setRejected)

      // createPedido
      .addCase(createPedido.pending, setPending)
      .addCase(createPedido.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createPedido.rejected, setRejected)

      // deletePedido
      .addCase(deletePedido.pending, setPending)
      .addCase(deletePedido.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((pedido) => pedido.id !== action.payload);
      })
      .addCase(deletePedido.rejected, setRejected);
  },
});

// --- Selectores ------------------------------------------------------------
export const selectPedidos = (state) => state.pedidos.items;
export const selectPedidosLoading = (state) => state.pedidos.loading;
export const selectPedidosError = (state) => state.pedidos.error;

export default pedidosSlice.reducer;
