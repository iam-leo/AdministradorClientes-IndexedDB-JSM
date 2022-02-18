(function(){
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', ()=>{
        crearDB();

        if(window.indexedDB.open(['crm'], 1)){
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function crearDB(){
        //Crear la DB de indexedDB
        const crearDB = window.indexedDB.open('crm', 1);

        //Si se creo la DB correctamente
        crearDB.onsuccess = () => {
            console.log('DB creada correctamente');
        }

        //Si hubo un error
        crearDB.onerror = () => {
            console.log('Hubo un error, DB no creada');
            DB = crearDB.result;
            console.log(DB);
        }

        //Configuracion de la DB
        crearDB.onupgradeneeded = e =>{
            const db = e.target.result;

            const objStore = db.createObjectStore('crm', {keyPath: 'id', autoIncrement: true});

            objStore.createIndex('nombre', 'nombre', {unique: false});
            objStore.createIndex('email', 'email', {unique: true});
            objStore.createIndex('telefono', 'telefono', {unique: false});
            objStore.createIndex('empresa', 'empresa', {unique: false});
            objStore.createIndex('id', 'id', {unique: true});

            console.log('DB creada y lista');
        }
    }

    function obtenerClientes(){
        const abrirConexion = window.indexedDB.open(['crm'], 1);

        abrirConexion.onerror = () =>{
            console.log('Hubo en error al cargar datos');
        }

        abrirConexion.onsuccess = () =>{
            DB = abrirConexion.result;
            const objStore = DB.transaction('crm').objectStore('crm');

            objStore.openCursor().onsuccess = (e) =>{
                const cursor = e.target.result;

                if(cursor){
                    const { nombre, email, telefono, empresa, id } = cursor.value;

                    listadoClientes.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 flex justify-center items-center">
                                <a href="editar-cliente.html?id=${id}" class="bg-indigo-600 hover:bg-indigo-900 mr-5 text-white px-3 py-2 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </a>

                                <a href="#" data-cliente="${id}" class="bg-red-600 hover:bg-red-900 text-white px-3 py-2 rounded-lg eliminar">
                                    <svg id="svg" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 eliminar" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path id="path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" class="eliminar" />
                                    </svg>
                                </a>
                            </td>
                        </tr>
                    `;

                    cursor.continue();
                }else{
                    console.log('No hay mas registros');
                }
            }
        }
    }

    function eliminarRegistro(e){
        if(e.target.classList.contains('eliminar')){
            let idEliminar;
            let confirmacion;
            let tr;

            //Obeter IDs
            if(e.target.id === 'svg'){
                idEliminar = Number(e.target.parentNode.dataset.cliente);
                tr = e.target.parentNode.parentNode.parentNode;
                confirmacion = confirmBorrarRegistro();
            } else if(e.target.id === 'path'){
                idEliminar = Number(e.target.parentNode.parentNode.dataset.cliente);
                tr = e.target.parentNode.parentNode.parentNode.parentNode;
                confirmacion = confirmBorrarRegistro();
            } else{
                idEliminar = Number(e.target.dataset.cliente);
                tr = e.target.parentNode.parentNode;
                confirmacion = confirmBorrarRegistro();
            }

            console.log(tr);

            if(confirmacion){
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objStore = transaction.objectStore('crm');

                objStore.delete(idEliminar);

                transaction.oncomplete = () => {
                    tr.remove();
                }

                transaction.onerror = () =>{
                    console.log('Hubo un error');
                }
            }
        }
    }

    function confirmBorrarRegistro(){
        const confirmar = confirm('Deseas eliminar este registro?');
        return confirmar;
    }
})();