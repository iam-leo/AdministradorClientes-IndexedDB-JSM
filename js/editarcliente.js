(function(){
    let idCliente;
    const nombreInput = document.querySelector('#nombre'),
          emailInput = document.querySelector('#email'),
          telefonoInput = document.querySelector('#telefono'),
          empresaInput = document.querySelector('#empresa'),
          form = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () =>{
        conectarDB();

        //Actualizar registro
        form.addEventListener('submit', actualizarCliente);

        //Verificar el ID de la URL
        const location = window.location.search;
        const parametrosURL = new URLSearchParams(location);
        idCliente = parametrosURL.get('id');

        if(idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    function conectarDB(){
        //Abrir conexion DB
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = () =>{
            console.log('Hubo un error al abrir DB');
        }

        abrirConexion.onsuccess = () =>{
            console.log('Conexion abierta');
            DB = abrirConexion.result;
        }


    }

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objStore = transaction.objectStore('crm');

        const cliente = objStore.openCursor();
        cliente.onsuccess = (e) =>{
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente){
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function actualizarCliente(e){
        e.preventDefault();

        //Validar form
        if( nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return
        }

        //Actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objStore = transaction.objectStore('crm');
        objStore.put(clienteActualizado);

        transaction.oncomplete = () =>{
            imprimirAlerta('Cliente modificado');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = () =>{
            imprimirAlerta('Ocurrio un error', 'error');
        }
    }
})();