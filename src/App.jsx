import React from 'react';
import './App.css'; 

// Asumimos que tienes un archivo CSS para estilos
const App = () => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <img src="/img/INOACLOGOes.png" alt="INOAC Sistemas Exteriores" className="logo" />
        <div className="clock">
          <span className="time">06:41:16 p. m.</span>
          <span className="date">sábado, 15 de junio de 2024</span>
        </div>
      </div>
      <div className="main-content">
        <div className="no-connection">
          <span>NO HAY CONEXIÓN AL PLC.</span>
        </div>
        <div className="status-container">
          <div className="status-item">
            <div className="label">TIEMPO DE PRODUCCIÓN</div>
            <div className="value">0h 0m</div>
          </div>
          <div className="status-item">
            <div className="label">TIEMPO MUERTO</div>
            <div className="value">0h 0m</div>
          </div>
          <div className="status-item">
            <div className="label"># DE PAROS</div>
            <div className="value">0</div>
          </div>
        </div>
        <div className="pending-downtimes">
          <span>TIEMPOS MUERTOS PENDIENTES</span>
        </div>
        <div className="scheduled-downtime">
          <span>PARO PROGRAMADO</span>
        </div>
      </div>
    </div>
  );
};

export default App;
