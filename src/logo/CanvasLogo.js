import React, { useEffect, useRef } from 'react';

const CanvasLogo = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a simple logo shape (circle)
    ctx.beginPath();
    ctx.arc(50, 50, 40, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = '#007bff';
    ctx.fill();

    // Add the text "YT"
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('YT', 50, 50);
  }, []);

  return (
  <div className='btn mx-5'>
    <canvas 
        ref={canvasRef} 
        width="60" 
        height="60" 
        style={{ display: 'flex', margin: '0 auto', backgroundColor: '#f0f0f0' }} 
        />
  </div>
   
  );
};

export default CanvasLogo;
