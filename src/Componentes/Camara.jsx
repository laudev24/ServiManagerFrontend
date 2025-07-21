import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';


const Camara = ({activo , onData }) => {
    const videoRef = useRef(null); // Para mostrar la transmisión de la cámara
    const canvasRef = useRef(null); // Para capturar la imagen
    const [stream, setStream] = useState(null);
    const [photoData, setPhotoData] = useState(null); // Para almacenar la imagen capturada
    const [fotoFile, setFotoFile] = useState(null); // Para almacenar el archivo de la foto

    useEffect(() => {
        // Solicitar acceso a la cámara cuando el componente se monta
        async function setupCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = mediaStream;                
                setStream(mediaStream);            
            } catch (err) {
                console.error("Error al acceder a la cámara: ", err);
                toast("No se pudo acceder a la cámara. Asegúrate de que los permisos estén habilitados.");
            }        
        }
        setupCamera();
        // Limpiar la transmisión de la cámara cuando el componente se desmonta
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }        
        };    
    }, []); 
    // 2. Tomar la Foto
    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Asegurar que el canvas tenga las mismas dimensiones que el video            
            canvas.width = video.videoWidth;            
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

             // ✅ Convertir el contenido del canvas a Blob y luego a File
            canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], "foto.jpg", { type: "image/jpeg" });
                if (!file) {
                    alert("Primero toma una foto.");
                }else{
                onData(file)
                }
                setFotoFile(file);
                console.log("📸 Foto capturada como File", file);

            }
            }, "image/jpeg", 0.9);
            // Obtener la imagen como un Data URL (Base64)
            // const imageData = canvas.toDataURL('image/jpeg', 0.9); // 0.9 es la calidad JPEG            
            // setPhotoData(imageData);            
            // console.log("Foto capturada:", imageData.substring(0, 50) + "..."); // Mostrar un fragmento        
        }    
    };
    // 3. Enviar la Foto 
    // const uploadPhoto = async () => {
    //     if (!fotoFile) {
    //         alert("Primero toma una foto.");
    //         return;
    //     }
    //     console.log("Foto a enviar:", fotoFile);
    //     onData(fotoFile); // Enviar el archivo de foto al componente padre
        

       
    // };

    return (
        <div className={`camara-container ${activo ? 'activo' : ''}`}>
            <video ref={videoRef} autoPlay playsInline muted ></video><br />
            <button onClick={takePhoto} disabled={!stream}>Tomar Foto</button>
            {fotoFile && (
                <>
                    <h3>Previsualización</h3>
                    <img src={URL.createObjectURL(fotoFile)} alt="Previsualización" className='prev' />
                    <br />
                    {/* <p >Si querés enviar esta foto hacé click en Confirmar. De lo contrario, tomá otra foto.</p>
                    <button onClick={uploadPhoto}>Confirmar</button> */}
                </>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> {/* Canvas oculto para la captura */}
        </div>
    );
}

export default Camara;
 