import productos from "./ejemplos/productos.json"
import Tarjeta from "./ejemplos/Tarjeta.jsx"

function App() {

  function comprar(nombre) {
    alert(`Compraste ${nombre}`)
  }

  return (
    <div style={styles.container}>

      {productos.map((producto) => (
        <Tarjeta
          key={producto.Id}
          titulo={producto.Titulo}
          precio={producto.Precio}
          imagen={producto.Imagen}
          vendedor={producto.Vendedor}
          cantvendida={producto.CantVendida}
          puntuacion={producto.Puntuacion}

          // prop función
          onComprar={() => comprar(producto.titulo)}
        >

          {/* children */}
          <p>Envío gratis 🚚</p>
          <p>Envio Internacional: {producto.Internacional ? "Sí" : "No"}</p>

        </Tarjeta>
      ))}

    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap"
  }
}

export default App