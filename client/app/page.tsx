"use client";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';


export default function Home() {
  const [message, setMessage] = useState('None received.');
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4040', {
      autoConnect: true
    });
    setSocket(newSocket);
    newSocket.on('message', (data) => setMessage(data));
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <main>
      {socket && (
        <>
          <button onClick={() => socket.emit('message', 'Test data')}>Send Message</button>
          <p>Message from server: {message}</p>
        </>
      )}
    </main>
  )
}
