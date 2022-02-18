let DB;
const form = document.querySelector('#formulario');

function conectarDB(){
    //Abrir conexion DB
    const abrirConexion = window.indexedDB.open('crm', 1);

    abrirConexion.onerror = () =>{
        console.log('Hubo un error al abrir DB');
    }

    abrirConexion.onsuccess = () =>{
        DB = abrirConexion.result;
    }
}

function imprimirAlerta(mensaje, tipo){
    const alerta = document.querySelector('.alerta');

    if(!alerta){
        //Crear Alerta
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alerta');

        if(tipo === 'error'){
            divMensaje.classList.add('bg-red-600', 'text-white');
        }else{
            divMensaje.classList.add('bg-green-600', 'text-white');
        }

        //Agregar el contenido del mensaje
        divMensaje.textContent = mensaje;

        //Mostrar en el html
        form.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}