import React, { useRef, useState } from 'react';

const ImageUploader = ({activo, onFotoElegida}) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null); // Para mostrar la vista previa
  const [imageFile, setImageFile] = useState(null); // Para almacenar el archivo a enviar

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Solo queremos el primer archivo (una sola foto)
    if (file) {
      setImageFile(file); // Guarda el archivo para enviarlo después

      // Crea una URL para la vista previa de la imagen seleccionada
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file); // Lee el archivo como Data URL para la vista previa
    } else {
      setSelectedImage(null);
      setImageFile(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Simula un clic en el input de archivo oculto
  };

  const sendImageToBackend = async () => {
    if (!imageFile) {
      alert('Por favor, selecciona una imagen primero.');
      return;
    }
    else{
    console.log(imageFile)
    onFotoElegida(imageFile)
    }
    const formData = new FormData();
    // 'image' es el nombre del campo que tu backend esperará
    formData.append('image', imageFile, imageFile.name);

    // try {
    //   // Reemplaza '/api/uploadimage' con la URL de tu endpoint de .NET
    //   const response = await fetch('/api/uploadimage', {
    //     method: 'POST',
    //     body: formData,
    //     // No establezcas 'Content-Type' manualmente cuando usas FormData,
    //     // el navegador lo hace automáticamente y le asigna el boundary correcto.
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     console.log('Imagen subida exitosamente:', data);
    //     alert('Imagen subida exitosamente!');
    //     // Opcional: Reinicia el estado después de subir
    //     setSelectedImage(null);
    //     setImageFile(null);
    //   } else {
    //     const errorData = await response.json();
    //     console.error('Error al subir la imagen:', errorData);
    //     alert('Error al subir la imagen.');
    //   }
    // } catch (error) {
    //   console.error('Error de red al subir la imagen:', error);
    //   alert('Error de conexión al servidor.');
    // }
  };

  return (
    <div className={`image-uploader-container ${activo ? 'activo' : ''}`}>
      <h3>Seleccionar Foto de la Galería</h3>
      <input
        type="file"
        accept="image/*" // Permite seleccionar solo archivos de imagen
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} // Oculta el input de archivo por defecto
      />
      <button onClick={handleUploadClick}>Seleccionar Foto</button>

      {selectedImage && (
        <div className="image-preview">
          <h4>Vista Previa:</h4>
          <img
            src={selectedImage}
            alt="Vista previa de la imagen seleccionada"
            style={{ maxWidth: '300px', maxHeight: '300px', marginTop: '10px' }}
          />
          <br/>
          <button onClick={sendImageToBackend} style={{ marginTop: '10px' }}>
            Enviar Foto al Servidor
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
