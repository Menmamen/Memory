"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("juego");
    let tabla = document.createElement("table");
    let movimientos = 0;
    let tiempo = 0;
    let intervaloTiempo;
    let pausado = false;
    const mensajeVictoria = document.getElementById("mensajeVictoria");
    const botonReiniciar = document.getElementById("botonReiniciar");
    const botonPausa = document.getElementById("botonPausa");
    const contadorMovimientos = document.getElementById("contadorMovimientos");
    const contadorTiempo = document.getElementById("contadorTiempo");
    const size = document.getElementById("size");

    // Tamaño de las cartas basado en el tamaño del tablero
    let tamanoCartas = 150; // Valor por defecto

    function iniciarJuego() {
        let filas = parseInt(size.value);
        let columnas = filas;
        contenedor.innerHTML = "";
        tabla = document.createElement("table");
        tabla.style.margin = "auto";
        tabla.style.borderCollapse = "collapse";
        contenedor.appendChild(tabla);
        mensajeVictoria.textContent = "";
        botonReiniciar.style.display = "none";
        movimientos = 0;
        tiempo = 0;
        pausado = false;
        contadorMovimientos.textContent = "Movimientos: 0";
        contadorTiempo.textContent = "Tiempo: 0s";
        if (intervaloTiempo) clearInterval(intervaloTiempo);
        intervaloTiempo = setInterval(() => {
            if (!pausado) { // Solo aumentar el tiempo si no está pausado
                tiempo++;
                contadorTiempo.textContent = `Tiempo: ${tiempo}s`;
            }
        }, 1000);

        // Ajustar tamaño de las cartas dependiendo del tamaño seleccionado
        if (filas === 4) {
            tamanoCartas = 200; // 4x4 tablero, cartas de 200x200
        } else {
            tamanoCartas = 150; // Otros tamaños de tablero, cartas de 150x150
        }

        let valores = [];

        // Generar pares de valores
        const imagenes = [
            { ruta: "./assets/img/foto01.png", nombre: "gorrion" },
            { ruta: "./assets/img/foto02.png", nombre: "axolotl" },
            { ruta: "./assets/img/foto03.png", nombre: "flotador" },
            { ruta: "./assets/img/foto04.png", nombre: "espalda" },
            { ruta: "./assets/img/foto05.png", nombre: "nevera" },
            { ruta: "./assets/img/foto06.png", nombre: "cansado" },
            { ruta: "./assets/img/foto07.png", nombre: "miedo" },
            { ruta: "./assets/img/foto08.png", nombre: "serpiente" },
            { ruta: "./assets/img/foto09.png", nombre: "viaje" },
            { ruta: "./assets/img/foto10.png", nombre: "frambuesa" },
            { ruta: "./assets/img/foto11.png", nombre: "brainEmpty" },
            { ruta: "./assets/img/foto12.png", nombre: "casita" },
            { ruta: "./assets/img/foto13.png", nombre: "caracol" },
            { ruta: "./assets/img/foto14.png", nombre: "halloween" },
            { ruta: "./assets/img/foto15.png", nombre: "ramen" },
            { ruta: "./assets/img/foto16.png", nombre: "aMimir" },
            { ruta: "./assets/img/foto17.png", nombre: "pesas" },
            { ruta: "./assets/img/foto18.png", nombre: "pocion" }
        ];

        // Reordenar imágenes de forma aleatoria
        imagenes.sort(() => Math.random() - 0.5);

        // Generar pares de imágenes
        for (let i = 0; (i < (filas * columnas / 2)); i++) {
            valores.push(imagenes[i]);
            valores.push(imagenes[i]);
        };
        // Barajar cartas
        valores = valores.sort(() => Math.random() - 0.5);

        let index = 0;
        let cartasVolteadas = [];
        let bloqueado = false; // Para evitar más clics mientras se procesan cartas

        for (let i = 0; i < filas; i++) {
            let fila = document.createElement("tr");
            tabla.appendChild(fila);
            for (let j = 0; j < columnas; j++) {
                let celda = document.createElement("td");
                let carta = document.createElement("div");
                carta.classList.add("carta");
                carta.dataset.valor = valores[index].nombre;
                carta.style.width = `${tamanoCartas}px`; // Establecer el tamaño dinámicamente
                carta.style.height = `${tamanoCartas}px`; // Establecer el tamaño dinámicamente
                carta.innerHTML = `
                <span class="frontal"></span>
                <span class="trasera">
                    <img src="${valores[index].ruta}" alt="${valores[index].nombre}">
                </span>
                `;
                index++;

                carta.addEventListener("click", () => {
                    if (pausado || bloqueado || cartasVolteadas.includes(carta) || carta.classList.contains("descubierta")) return;
                    carta.classList.add("volteada");
                    cartasVolteadas.push(carta);
                    movimientos++;
                    contadorMovimientos.textContent = `Movimientos: ${movimientos}`;
                    if (cartasVolteadas.length === 2) {
                        bloqueado = true;
                        let [carta1, carta2] = cartasVolteadas;
                        if (carta1.dataset.valor === carta2.dataset.valor) {
                            carta1.classList.add("descubierta");
                            carta2.classList.add("descubierta");
                            cartasVolteadas = [];
                            bloqueado = false;
                            verificarVictoria();
                        } else {
                            setTimeout(() => {
                                carta1.classList.remove("volteada");
                                carta2.classList.remove("volteada");
                                cartasVolteadas = [];
                                bloqueado = false;
                            }, 1000);
                        }
                    }
                });
                celda.appendChild(carta);
                fila.appendChild(celda);
            }
        }
    }
    function verificarVictoria() {
        if (document.querySelectorAll(".carta.descubierta").length === (tabla.rows.length * tabla.rows[0].cells.length)) {
            clearInterval(intervaloTiempo);

            // Obtener el tiempo y los movimientos actuales
            let tiempoFinal = tiempo;
            let movimientosFinales = movimientos;

            // Actualizar el mensaje de la ventana emergente
            document.getElementById("resumenVictoria").textContent =
                `Tiempo: ${tiempoFinal}s | Movimientos: ${movimientosFinales}`;

            // Mostrar la ventana emergente de victoria
            document.getElementById("ventanaVictoria").style.display = "flex";
        }
    }
    // Evento para cerrar la ventana emergente y reiniciar el juego
    document.getElementById("cerrarVentana").addEventListener("click", () => {
        document.getElementById("ventanaVictoria").style.display = "none";
        iniciarJuego(); // Reiniciar el juego
    });


    botonReiniciar.addEventListener("click", () => iniciarJuego());
    size.addEventListener("change", () => iniciarJuego());

    // Evento para pausar y reanudar el tiempo
    botonPausa.addEventListener("click", () => {
        pausado = !pausado;
        botonPausa.textContent = pausado ? "Reanudar" : "Pausar";
    });


    // Mostrar la informacion del programador
    const abrirInfo = document.getElementById("abrirInfo");
    const ventanaInfo = document.getElementById("ventanaInfo");
    const cerrarInfo = document.getElementById("cerrarInfo");

    abrirInfo.addEventListener("click", function (event) {
        if (event.target.tagName !== "IMG") return; // Solo permite clics en la imagen
        event.preventDefault();
        ventanaInfo.style.display = "flex";
    });

    cerrarInfo.addEventListener("click", function () {
        ventanaInfo.style.display = "none"; // Oculta la ventana emergente
    });

    iniciarJuego();


});


