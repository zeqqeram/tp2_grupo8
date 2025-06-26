// Función para reemplazar el desbordamiento de texto por puntos suspensivos
// Resuelto con js para evitar incompatibilidades de webkit

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

document.addEventListener('DOMContentLoaded', () => {
  suspensivos('.textoEditable');
});

//Sistema de filtrado para el buscador con elementos estáticos
//Buscador te odio 
//Versión replicando la card secundaria de comentarios

document.addEventListener('DOMContentLoaded', () => {
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
});

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

