// import { DB, conectarDB, imprimirAlerta  } from './funciones.js';

(function(){
    const form = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        form.addEventListener('submit', validarCliente);
    });

    function validarCliente(e) {
        e.preventDefault();

        //Leer inputs del form
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los campos son obligatorios.', 'error');

            return;
        }

        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()
        }

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objStore = transaction.objectStore('crm');

        objStore.add(cliente);

        transaction.onerror = () => {
            imprimirAlerta('No se puede añadir clientes con mismo email.', 'error');
        }

        transaction.oncomplete = () => {
            imprimirAlerta('Cliente añadido.', 'ok');
            form.reset();

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }


    }
})();