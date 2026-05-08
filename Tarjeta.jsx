function Tarjeta({titulo, precio, imagen, Internacional,vendedor, cantvendida , puntuacion, onComprar, children}){
return(
        <div style={styles.card}>
      <img src={imagen} alt={titulo} style={styles.imagen} />

      <h2>{titulo}</h2>
    <p> <strong>{vendedor}</strong> </p>
      <p>{cantvendida} vendidos</p>
      <p>{puntuacion} estrellas</p>
      <p>${precio}</p>

      <button onClick={onComprar}>
        Comprar
      </button>

      <h3>{Internacional}</h3>
      <div>
        {children}
      </div>
    </div>
)
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    width: "220px",
    borderRadius: "10px"
  },

  imagen: {
    width: "100%"
  }
}

export default Tarjeta;