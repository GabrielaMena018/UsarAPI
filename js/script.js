
//URL de la API - enpoint
const API_URL = "https://retoolapi.dev/39xMC5/expo";

//Funcion para llamar a la APi y traer el JSON
async function ObtenerPersonas() {
    //Obtenemos la repsuesta del servidor 
    const res = await fetch(API_URL); //Obtener datos de la API

    //Convertir la respuesta del servidor a formato JSON
    const data = await res.json(); //esto es un JSON

    CrearTabla(data); //Enviamos el JSON a la función "CrearTabla".

}


//Funcion que creara las filas de las tablas en base a los registros que vienne de la API

function CrearTabla(datos) { //"Datos" representa al JSON que viene de la API
    //Se llama al "tbody" dentro de la tabla id "tabla"

    const tabla = document.querySelector("#tabla tbody");

    //inner HTML es para inyectar código HTML desde JS
    tabla.innerHTML = ""; //Vaciamos el contenido de la tabla

    datos.forEach(persona => {
        tabla.innerHTML += `
            <tr>
                    <td>${persona.id}</td>
                    <td>${persona.nombre}</td>
                    <td>${persona.apellido}</td>
                    <td>${persona.edad}</td>
                    <td>${persona.correo}</td>
                    <td> 
                        <button onClick ="AbrirModalEditar(${persona.id}, '${persona.nombre}', '${persona.apellido}', ${persona.edad}, '${persona.correo}' )" > Editar</button>
                        <button onClick="EliminarRegistro(${persona.id})">Eliminar</button>
                    </td>
            </tr>
        `;
    });

}

ObtenerPersonas();



//Proceso para agregar un integrante o nuev registro
const modal = document.getElementById("modalAgregar");
const btnAgregar = document.getElementById("btn-AbrirModal");
const btnCerrar = document.getElementById("btn-CerrarModal");


btnAgregar.addEventListener("click", () => {
    modal.showModal();

});

btnCerrar.addEventListener("click", () => {
    modal.close();
})


//agregar nuevo integrante desde el formulario
document.getElementById("frm-AgregarIntegrante").addEventListener("submit", async e => {
    e.preventDefault(); //"e" represneta al evento Submit - Evita que el formulario se envie

    //Capturamos los valores del fromulario 
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const edad = document.getElementById("edad").value.trim();
    const correo = document.getElementById("email").value.trim();

    //Validación basica
    if (!nombre || !apellido || !correo || !edad) {
        alert("Complete todos los campos");
        return; //Evita que el codigo se siga ejecutando
    }


    //Llamar a la API para enviar el usuario
    const respuesta = await fetch(API_URL, {
        method: "POST", //Que queremos hacer en la API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, edad, correo })

    });


    if (respuesta.ok) {
        alert("El registro fue agregado correctamente");

        //Limpiar el formulario
        document.getElementById("frm-AgregarIntegrante").reset();

        //Cerrar el formulario
        modal.close();

        //Recargar Tabla
        ObtenerPersonas();
    }
    else {
        alert("Hubo un error al agregar al integrante");
    }




}); //Fin del formulario

//para eliminar registros
async function EliminarRegistro(id) {
    if (confirm("¿Está seguro de eliminar este registro?")) {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        ObtenerPersonas();

    }
};


//Abrir el formulario
const modalEditar = document.getElementById("modalEditar");
const btnCerrarEditar = document.getElementById("btn-CerrarEditar");


//Cerrar modal
btnCerrarEditar.addEventListener("click", () => {
    modalEditar.close();
});

//esta funcion nos permite mandarle los valores antes de abrir el modal
function AbrirModalEditar(id, nombre, apellido, edad, correo) {
    document.getElementById("idEditar").value = id;
    document.getElementById("nombreEditar").value = nombre;
    document.getElementById("apellidoEditar").value = apellido;
    document.getElementById("edadEditar").value = edad;
    document.getElementById("emailEditar").value = correo;


    modalEditar.showModal(); //abrir el modal


};

//para actualizar los registros
document.getElementById("frm-EditarIntegrante").addEventListener("submit", async e =>{
    e.preventDefault(); //Evitamos que el formulario se envie de inmediato
    const id =  document.getElementById("idEditar").value;
    const nombre = document.getElementById("nombreEditar").value.trim();
    const apellido =  document.getElementById("apellidoEditar").value.trim();
    const edad = document.getElementById("edadEditar").value.trim();
    const correo =  document.getElementById("emailEditar").value.trim();

    //Validación basica
    if (!nombre || !apellido || !correo || !edad || !id) {
        alert("Complete todos los campos");
        return; //Evita que el codigo se siga ejecutando
    }
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT", //Que queremos hacer en la API
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({edad, correo, nombre, apellido })

        });

        if(respuesta.ok){
            alert ("Registro actualizado correctamente");
            modalEditar.close();
            ObtenerPersonas(); //Recargar la lista
        }
}); 
