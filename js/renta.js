let peliculasData = [];

$(document).ready(function() {
    cargarPeliculasParaRenta();
    $('#peliculasSelect').on('change', calcularTotal);
    $('#diasRenta').on('input', calcularTotal);
    $('#formRenta').on('submit', validarYEnviarRenta);
});

function cargarPeliculasParaRenta() {
    $.ajax({
        url: 'data/peliculas.json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            peliculasData = data.peliculas;
            const select = $('#peliculasSelect');
            select.empty();
            data.peliculas.forEach(function(pelicula) {
                const precioInfo = calcularPrecio(pelicula);
                select.append(`<option value="${pelicula.id}" data-precio="${precioInfo.precio}">${pelicula.titulo} - $${precioInfo.precio.toFixed(2)}</option>`);
            });
        }
    });
}

function calcularTotal() {
    const peliculasSeleccionadas = $('#peliculasSelect').val() || [];
    const dias = parseInt($('#diasRenta').val()) || 1;
    let total = 0;
    
    peliculasSeleccionadas.forEach(function(peliculaId) {
        const option = $(`#peliculasSelect option[value="${peliculaId}"]`);
        const precio = parseFloat(option.data('precio'));
        total += precio * dias;
    });
    
    if (total > 0) {
        $('#totalDisplay').show();
        $('#totalMonto').text('$' + total.toFixed(2));
    } else {
        $('#totalDisplay').hide();
    }
}

function validarYEnviarRenta(e) {
    e.preventDefault();
    const nombre = $('#nombreCliente').val().trim();
    const peliculasSeleccionadas = $('#peliculasSelect').val();
    const dias = parseInt($('#diasRenta').val());
    const formaPago = $('#formaPago').val();
    
    if (nombre && peliculasSeleccionadas && peliculasSeleccionadas.length > 0 && dias && formaPago) {
        mostrarResumenRenta();
    }
}

function mostrarResumenRenta() {
    const nombre = $('#nombreCliente').val().trim();
    const peliculasSeleccionadas = $('#peliculasSelect').val();
    const dias = parseInt($('#diasRenta').val());
    const formaPago = $('#formaPago option:selected').text();
    
    let peliculasHTML = '<ul>';
    let total = 0;
    
    peliculasSeleccionadas.forEach(function(peliculaId) {
        const pelicula = peliculasData.find(p => p.id === peliculaId);
        const precioInfo = calcularPrecio(pelicula);
        const subtotal = precioInfo.precio * dias;
        total += subtotal;
        peliculasHTML += `<li><strong>${pelicula.titulo}</strong> - $${precioInfo.precio.toFixed(2)} x ${dias} día(s) = $${subtotal.toFixed(2)}</li>`;
    });
    peliculasHTML += '</ul>';
    
    const resumen = `
        <div><p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Películas:</strong></p>${peliculasHTML}
        <p><strong>Días:</strong> ${dias}</p>
        <p><strong>Forma de pago:</strong> ${formaPago}</p>
        <hr><h4 class="text-success">Total: $${total.toFixed(2)}</h4></div>
    `;
    
    $('#resumenRenta').html(resumen);
    const modal = new bootstrap.Modal(document.getElementById('modalRenta'));
    modal.show();
    
    $('#modalRenta').on('hidden.bs.modal', function() {
        $('#formRenta')[0].reset();
        $('#totalDisplay').hide();
    });
}