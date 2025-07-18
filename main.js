// Función para reemplazar el desbordamiento de texto por puntos suspensivos. Resuelto con js para evitar incompatibilidades de webkit
function suspensivos(selector) {
  const elementos = document.querySelectorAll(selector);
  if (!elementos.length) return;

  elementos.forEach(elemento => {
    const alturaMax = parseInt(elemento.dataset.altura, 10); // lee data-altura del HTML
    if (!alturaMax) return;

    const textoOriginal = elemento.textContent.trim();
    let texto = textoOriginal;
    elemento.textContent = texto;

    while (elemento.scrollHeight > alturaMax && texto.length > 0) {
      texto = texto.slice(0, -1).trim();
      elemento.textContent = texto + '...';
    }
  });
}
suspensivos('.textoEditable');


//Sistema de filtrado para el buscador con elementos estáticos replicando la card secundaria de comentarios
const input = document.getElementById('buscador');
const cards = document.querySelectorAll('.card');
const contenido = document.getElementById('contenido_original');
const contenedorResultados = document.getElementById('contenedor_filtrados');

input.addEventListener('input', () => {
  const valorBuscado = input.value.toLowerCase().trim();

  if (valorBuscado === '') {
    contenido.style.display = '';
    contenedorResultados.innerHTML = '';
    contenedorResultados.style.display = 'none';
    return;
  }

  contenido.style.display = 'none';
  contenedorResultados.innerHTML = '';
  contenedorResultados.style.display = 'flex';

  cards.forEach(card => {
    const titulo = card.querySelector('h1, h2, h3')?.textContent || '';
    if (!titulo.toLowerCase().includes(valorBuscado)) return;

    //const autor = card.querySelector('.autor span')?.textContent || 'Sin autor';
    //const fecha = card.querySelector('.fecha')?.textContent || 'Sin fecha';
    const valor = card.querySelectorAll('.datos_valor-comentario h3')[0]?.textContent || '-';
    const comentarios = card.querySelectorAll('.datos_valor-comentario h3')[1]?.textContent || '0';
    const background = getComputedStyle(card).backgroundImage;
    const imagenURL = background.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    const nuevaCard = document.createElement('div');

    nuevaCard.className = 'comentada_secundaria card';
    nuevaCard.style.backgroundImage = `url("${imagenURL}")`;
    nuevaCard.innerHTML = `
        <div class="textos secundaria_texto">
          <h2 class="texto_blanco textoEditable" data-altura="60">${titulo}</h2>
            <div class="texto_datos">
              <div class="valores_secundarias">
                <p  class="texto_blanco">por <span>Maca Reynolds</span></p>
                <div class="datos">
                  <p class="texto_blanco">jun. 3 de 2025</p>
                  <div class="datos_valor-comentario">
                    <h3 class="texto_blanco">${valor}</h3>
                    <img src="./img/valor.png" alt="icono de valoración">
                  </div>
                  <div class="datos_valor-comentario">
                    <h3 class="texto_blanco">${comentarios}</h3>
                    <img src="./img/comentario.png" alt="Icono de comentarios">
                  </div>
                </div>
            </div>
        </div> `;
    console.log(nuevaCard.querySelector('.secundaria_texto'));
    contenedorResultados.appendChild(nuevaCard);
  });
});


//Conexión a server
const API_URL = "https://685f48b2c55df675589dfaab.mockapi.io/peliculas";


//Requisición GET
async function getPeliculas() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) throw new Error("No se pudo obtener los productos");
    console.log("Productos obtenidos: ", response);

    return await response.json();
  } catch (error) {
    console.error("Error en GET: ", error);
    throw error;
  }
}

//Muestra las películas si estamos en la sección
async function mostrarPeliculas() {
  const listaPeliculas = document.querySelector(".lista_novedades");
  listaPeliculas.innerHTML = "";

  try {
    const peliculas = await getPeliculas();

    peliculas.forEach((pelicula) => {
      const peliculaCard = document.createElement("div");
      peliculaCard.classList.add("pelicula_card");
      peliculaCard.innerHTML = `
      <a class="link_nota" href='./nota.html'>
            <img class="imagen_card" src="${pelicula.url}" alt="Foto del producto">
            <div class="textos_card">
              <h2 class="texto_titular">${pelicula.titular}</h2>
              <p class="bajada_card">${pelicula.bajada}</p>
                <div class="datos_card">
                  <p>por <span>${pelicula.redactor}</span></p>
                  <p>${pelicula.fecha}</p>
                  <div class="datos_valor-comentario">
                    <h3>${pelicula.valoracion}</h3>
                    <img class="icon_datos" src="../../img/valor_negro.png" alt="icono de valoración">
                  </div>
                  <div class="datos_valor-comentario">
                    <h3>${pelicula.comentarios}</h3>
                    <img class="icon_datos" src="../../img/comentario_negro.png" alt="Icono de comentarios">
                  </div>
                </div>
            </div>
            </a>
            `;
      listaPeliculas.appendChild(peliculaCard);
    });
  }
  catch (error) {
    console.error("Error al mostrar los productos: ", error);
  }
}

const listaPeliculas = document.querySelector(".lista_novedades");
if (listaPeliculas) {
  console.log("Cargando peliculas...");
  mostrarPeliculas();
};

// Mostrar nombre de user en el nav si esta logeado
const nombreUser = localStorage.getItem('user');

if (nombreUser) {
  const perfil = document.querySelector('.perfil_a');
  const span = perfil?.querySelector('span');

  if (span) {
    span.textContent = nombreUser;
  }
}

// Verificación de user logueado
const userLogeado = Boolean(nombreUser);

if (userLogeado) {
  const perfil = document.querySelector('.perfil_a');
  const miPerfil = document.querySelector('.mi_perfil');
  const seccionForm = document.querySelector('.seccion_form');
  const datoUsuario = document.querySelector('.dato_usuario');

  if (perfil && miPerfil && datoUsuario) {
    perfil.classList.add('perfil_active');
    miPerfil.classList.remove('oculto');

    const span = perfil.querySelector('span');
    const p = datoUsuario.querySelector('p');

    if (span && p) {
      span.textContent = nombreUser;
      p.textContent = nombreUser;
    }

    if (seccionForm) {
      seccionForm.style.display = 'none';
    }
  }
}

// Manejo del form de login
const formLogIn = document.getElementById('login');

if (formLogIn) {
  formLogIn.addEventListener('submit', function (event) {
    event.preventDefault();

    if (formLogIn.checkValidity()) {
      const nameInput = formLogIn.querySelector('input[name="usuario"]');
      const name = nameInput.value.trim();

      // Guardo el nombre en localStorage y actualizo los elementos
      localStorage.setItem('user', name);

      const perfil = document.querySelector('.perfil_a');
      const miPerfil = document.querySelector('.mi_perfil');
      const seccionForm = document.querySelector('.seccion_form');
      const datoUsuario = document.querySelector('.dato_usuario');

      if (perfil && name && miPerfil && datoUsuario) {
        perfil.classList.add('perfil_active');
        miPerfil.classList.remove('oculto');

        const span = perfil.querySelector('span');
        const p = datoUsuario.querySelector('p');

        if (span && p) {
          span.textContent = name;
          p.textContent = name;
        }

        if (seccionForm) {
          seccionForm.style.display = 'none';
        }
      }

      console.log("Usuario logeado correctamente");
    } else {
      formLogIn.reportValidity();
    }
  });
}

// manejo del modal si el user no esta logeado
document.getElementById("comentar")?.addEventListener("click", function () {
  if (!userLogeado) {
    document.getElementById("modal-seccion").style.display = "flex";
  }
});

document.querySelector(".cancelar")?.addEventListener("click", function () {
  document.getElementById("modal-seccion").style.display = "none";
});

window.addEventListener("click", function (event) {
  const modal = document.getElementById("modal-seccion");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Sistema de calificación del usuario
const estrellas = document.querySelectorAll('.user_calificacion');
let calificacionActual = 0;

function actualizarEstrellas(valor, imagen) {
  estrellas.forEach((estrella, index) => {
    estrella.src = index < valor ? imagen : '../img/estrella_roja-unactive.png';
  });
}

estrellas.forEach((estrella, i) => {
  estrella.addEventListener('click', () => {
    calificacionActual = i + 1;
    actualizarEstrellas(calificacionActual, '../img/estrella_roja-active.png');

    if (!userLogeado) {
      document.getElementById("modal-seccion").style.display = "flex";
    }
  });

  estrella.addEventListener('mouseover', () => {
    const hoverIndex = i + 1;
    actualizarEstrellas(hoverIndex, '../img/estrella_roja.png');
  });

  estrella.addEventListener('mouseout', () => {
    actualizarEstrellas(calificacionActual, '../img/estrella_roja-unactive.png');
  });
});


// Titulos dinamicos
const tituloSeccion = document.getElementById("titulo-seccion");

if (tituloSeccion) {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (categoria) {
    const tituloVisible = {
      noticias: "NOTICIAS",
      entrevistas: "ENTREVISTAS",
      favoritas: "TUS FAVORITAS",
    };

    tituloSeccion.textContent = tituloVisible[categoria] || "Películas";
  } else {
    tituloSeccion.textContent = "Películas";
  }
}

//Manejo de nuevos comentarios 
document.getElementById("comentar")?.addEventListener("click", function() {
  const comentarioTexto = document.getElementById("comentario_user").value.trim();

  if (comentarioTexto === "") {
    console.log ("El comentario esta vacío");
  }

  const contenedor = document.getElementById("comentarios_nuevos");
  const fecha = new Date();
  const opciones = {month: 'short', day: 'numeric', year: 'numeric'};
  const fechaFormateada = fecha.toLocaleDateString('es-AR', opciones);

  const nuevoComentario = document.createElement("div");
  nuevoComentario.classList.add("coment");
  nuevoComentario.innerHTML = `
  <img class="coment_foto" src="../img/foto_perfil.png" alt="Tu foto">
  <div class="coment_contenido">
    <div class="no_accionables">
      <div class="coment_datos">
        <p><span>${nombreUser}</span></p>
        <p>${fechaFormateada}</p>
      </div>
      <p>${comentarioTexto}</p>
    </div>
    <div class="acciones">
      <button class="responder">RESPONDER</button>
      <div class="datos">
        <div class="datos_valor-comentario">
          <h3>0</h3>
          <img src="../img/valor_negro.png" alt="icono de valoración">
        </div>
        <div class="datos_valor-comentario">
          <h3>0</h3>
          <img src="../img/comentario_negro.png" alt="Icono de comentarios">
        </div>
      </div>
    </div>
  </div>
`;

contenedor.appendChild(nuevoComentario);
document.getElementById("comentario_user").value = "";
});

//Nombre de user en comentarios de perfil

if (nombreUser) {
  const userName = document.querySelectorAll('.userName span');

  userName.forEach(p => {
    p.textContent = nombreUser;
  });
}

/*
 Durante el desarrollo me encontre con un problema en dev tools de Chrome: se generaba un scroll fantasma cuando hacia el resposive a 1440px. 
 Estuve revisando con Js y también linea a linea por posibles desbordamientos y no encontré ninguno. 
 Además al actualizar la página ya con dev tools abierto el scroll desaparece. 
 Investigue al respecto y solo encontre una posible causa: la recarga automatica de la web, tengo una posible solucion con un script de js, 
 pero aun no fue aplicada porque no lo consideré prioritario. 
 Como dije la web no tiene desbordamientos en una pc de 1440px en realidad, lo comprobe en un monitor fisico. 
 Además dicho scroll no muestra una barra de scrolleo ni nada solo permite arrastrar en devtools 
 y desaparece al volver a cargar el link en el navgador con devtolls ya abierto a 1440px.
*/

// Función para marcar en pantalla los desbordes Round 2
(function () {
  var slice = Array.prototype.slice;

  function throttle(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function () {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  }

  slice
    .call(document.querySelectorAll("*"))
    .filter(
      e => e.scrollWidth > e.offsetWidth || e.scrollHeight > e.offsetHeight
    )
    .filter(e => {
      var style = window.getComputedStyle(e);
      return [style.overflow, style.overflowX, style.overflowY].some(
        e => e === "auto" || e === "scroll"
      );
    })
    .forEach(e => {
      var color = Math.floor(Math.random() * 16777215).toString(16);
      e.style.backgroundColor = "#" + color;
      throttle("scroll", "optimizedScroll", e);

      e.addEventListener("scroll", event => {
        console.log("%c[scroll]", "color: white; background-color:#" + color, event.target);
      });
    });
})();

