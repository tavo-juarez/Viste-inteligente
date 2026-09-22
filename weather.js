const mensaje = document.getElementById("mensaje");
const btnTiempo = document.getElementById("btnTiempo");
const inputNombre = document.getElementById("nombre");

//Funciones

//Verificamos que el nombre es valido, sin espacion y min dos caracteres
function esNombreValido(nombre) {
  const nombreLimpio = nombre.trim();

  // if (nombreLimpio.length >= 2) {
  //   return true;
  // } else {
  //   return false;
  // }

  //Mejoramos la declaracion condicional anterior en una sola linea de codigo porque esta declaracion en si misma produce un resultado buleano
  return nombreLimpio.length >= 2;
}

function obtenerRopaRecomendada(temperatura) {
  if (temperatura < 15) {
    return "Lleva un abrigo pesado.";
  }
  if (temperatura < 25) {
    return "Una chaqueta ligera o jersey es suficiente.";
  }
  return "Usa ropa fresca y camiseta corta.";
}

// 2. EVENTO CLICK Y GEOLOCALIZACIÓN

// Escuchamos el clic en el botón para ejecutar la lógica del clima
btnTiempo.addEventListener("click", () => {
  if (!esNombreValido(inputNombre.value)) {
    mensaje.textContent = "El nombre debe tener minimo dos caracteres";
    return;
  }
  //Si el nombre SÍ es válido, el código llega a esta línea:
  mensaje.textContent = ""; // <-- AQUÍ LIMPIAS EL MENSAJE DE ERROR

  // Solicitamos al navegador las coordenadas actuales del usuario
  //PARÁMETRO: 'posicion' es la plantilla/casilla vacía ("te doy mi número de teléfono")
  navigator.geolocation.getCurrentPosition(
    (posicion) => {
      console.log(posicion);

      // Accede a las coordenadas de longitud e imprime el valor en la consola
      console.log(posicion.coords.longitude);
      console.log(posicion.coords.latitude);

      // Guardamos la latitud y la longitud en variables separadas para que sea más fácil leerlas
      const lat = posicion.coords.latitude;
      const lon = posicion.coords.longitude;

      // Construimos la URL de la API de Open-Meteo.
      // Insertamos dinámicamente nuestras variables 'lat' y 'lon' dentro de la cadena usando comillas invertidas (``).
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m`;

      //PETICIÓN A LA API DE CLIMA (FETCH)

      // 1. PRIMER ARGUMENTO: ¿Qué hacer si hay GPS? 'url' es el valor real ("me llamas a mi número de teléfono")
      // que le enviamos a la función fetch() para solicitar los datos a esa dirección específica
      fetch(url)
        //PARÁMETRO: 'respuesta' recibe el paquete de respuesta en bruto que llega del servidor.
        .then((respuesta) => {
          // Convertimos la respuesta en bruto a un objeto JSON usable en JavaScript y lo devolvemos con 'return'.
          return respuesta.json();
        })
        //PARÁMETRO: 'datos' es el objeto ya traducido a JSON en el paso anterior.
        .then((datos) => {
          console.log(datos);
          console.log(datos.current.temperature_2m);

          const temperatura = datos.current.temperature_2m;

          //Usamos la variable pasándola como argumento a la función
          const ropa = obtenerRopaRecomendada(temperatura);

          // --- LÍNEA AÑADIDA PARA UX/UI (Cambio de fondo en CSS) ---
          // Con Operador Ternario (1 sola línea y usa 'const')
          const estadoClima = temperatura < 15 ? "frio" : temperatura < 25 ? "templado" : "calido";
          document.body.dataset.clima = estadoClima;

          // Con IF / ELSE (requiere 9 líneas y usar 'let')
          // let estadoClima;

          // if (temperatura < 15) {
          //   estadoClima = "frio";
          // } else if (temperatura < 25) {
          //   estadoClima = "templado";
          // } else {
          //   estadoClima = "calido";
          // }

          //Pintamos la recomendación en la pantalla para el usuario
          mensaje.textContent = `Hola ${inputNombre.value}, hace ${temperatura}°C: ${ropa}`;
        })
        .catch((error) => {
          // 1. Detalle técnico en la consola
          console.error("Detalle técnico del error:", error);

          // 2. Mensaje amigable para el usuario en la interfaz
          mensaje.textContent = "No pudimos obtener el clima. Inténtalo más tarde.";
        });
    },

    // 2. SEGUNDO ARGUMENTO: ¿Qué hacer si NO hay GPS o no da permiso?
    (errorUbicacion) => {
      console.error("Detalle técnico de geolocalización:", errorUbicacion);
      mensaje.textContent = "Para recomendarte ropa, activa el GPS y concede permisos de ubicación en tu navegador.";
    },
  );
});
