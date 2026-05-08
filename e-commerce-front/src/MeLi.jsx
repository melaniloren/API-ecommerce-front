import React from "react";
import { useState } from "react";
// import "./MeliCard.css";

const MeliCard = ({ children, titulo, descripcion, precio, imagen }) => {
  return (
    <div className="meli-card">
      <img src={imagen} alt="Imagen del producto" />
      <div className="meli-card-body">
        <h5 className="meli-card-title">{titulo}</h5>
        <p className="meli-card-text">{descripcion}</p>
        <p className="meli-card-text">
          <strong>{precio}</strong>
        </p>
        {children}
      </div>
    </div>
  );
};

export default MeliCard;
 