import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './App.css';

// Componente para mostrar el estado de la conexión
const ConnectionStatus = ({ isConnected }) => {
  return (
    <div className="connection-status">
      {isConnected ? 'CONECTADO' : 'NO HAY CONEXIÓN AL PLC.'}
    </div>
  );
};

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState('Cargando hora...');

  useEffect(() => {
    // Comprobación inicial del estado de conexión
    async function checkConnection() {
      try {
        const response = await fetch("http://192.168.100.177:5253/api/Tiempos/CheckUser");
        const isConnected = await response.json();
        setIsConnected(isConnected);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsConnected(false);
      }
    }

    // Configurar y empezar la conexión con SignalR
    const connection = new HubConnectionBuilder()
      .withUrl('http://192.168.100.177:5253/api/Tiempos/update-time')
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR Connected.');
      } catch (err) {
        console.error('Error while establishing connection:', err);
        setIsConnected(false);
      }
    }

    connection.on('ReceiveTime', (time) => {
      setCurrentTime(time);
    });

    startConnection();
    checkConnection();

    // Limpiar la conexión al desmontar el componente
    return () => {
      connection.stop().then(() => console.log('SignalR Disconnected.'));
    };
  }, []);

  return (
    <div className="app-container">
      <div className="sidebar">
        <img src="/img/INOACLOGOes.png" alt="INOAC Sistemas Exteriores" className="logo" />
        <div className="clock">
          <span className="time">{currentTime}</span>
          <span className="date">sábado, 15 de junio de 2024</span>
        </div>
      </div>
      <div className="main-content">
        <ConnectionStatus isConnected={isConnected} />
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
