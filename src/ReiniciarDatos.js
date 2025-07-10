// utils/preserveUserDataOnUnload.js

export const reiniciarDatos = () => {
  window.addEventListener('beforeunload', () => {
    const keysToPreserve = ['nombre', 'contraseña', 'token', 'esAdmin', 'clienteId'];
    const preservedData = {};

    // Guardamos los datos importantes
    keysToPreserve.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) preservedData[key] = value;
    });

    // Limpiamos todo el localStorage
    localStorage.clear();

    // Restauramos los datos importantes
    Object.entries(preservedData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  });
};
