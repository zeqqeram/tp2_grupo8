/* 
// Nav fija debajo del header pero bien arriba en scroll

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const offset = 100; //Esto es la altura de nuestro header

  window.addEventListener('scroll', () => {
    if (window.scrollY > offset) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
});
*/


// Función para marcar en pantalla los desbordes Round 2

(function() {
  var slice = Array.prototype.slice;

  function throttle(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
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

