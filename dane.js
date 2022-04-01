var localDB = new PouchDB('dane_localdb');
var remoteDB = new PouchDB('http://admin:12345678@192.168.0.26:5984/dane_remotedb');

var col_names = ["dni", "name", "apellidos", "direccion", "estrato", "movil", "email"]

function saveDoc()
{
    let _id = document.getElementById("dni").value;
    let name = document.getElementById("name").value;
    let apellidos = document.getElementById("apellidos").value;
    let direccion = document.getElementById("direccion").value;
    let estrato = document.getElementById("estrato").value;
    let movil = document.getElementById("movil").value;
    let email = document.getElementById("email").value;

    let doc = {
        _id: ""+_id,
        dni: ""+_id,
        name,
        apellidos,
        direccion,
        estrato,
        movil,
        email
    }

    localDB.put(doc).
    then(
        (error, result) =>
        {
            if(!!error)
            {
                console.log("save doc ok!");
                getDocs();
            }
        }
    )
}

function getDocs()
{
    let tableDocs = document.getElementById("tableDocs")
    localDB.allDocs({include_docs: true}).
    then(
        resp => resp.rows.
        forEach(
            (row) => {
            console.log(row.doc)            
            let tr = tableDocs.insertRow(-1)
            let td_dni = tr.insertCell(0)
            td_dni.innerHTML = row.doc["dni"] 
            let td_name = tr.insertCell(1)
            td_name.innerHTML = row.doc["name"] 
            let td_apellidos = tr.insertCell(2)
            td_apellidos.innerHTML = row.doc["apellidos"] 
            let td_direccion = tr.insertCell(3)
            td_direccion.innerHTML = row.doc["direccion"] 
            let td_estrato = tr.insertCell(4)
            td_estrato.innerHTML = row.doc["estrato"]  
            let td_movil = tr.insertCell(5)
            td_movil.innerHTML = row.doc["movil"] 
            let td_email = tr.insertCell(6)
            td_email.innerHTML = row.doc["email"]       
            
        })
    );
}

function replicate()
{
    localDB.replicate.to(remoteDB).on('complete', function () {
        console.log("yay, we're done!")
      }).on('error', function (err) {
        console.log("boo, something went wrong!")
      });
}

function sync()
{
    localDB.sync(remoteDB).on('complete', function () {
        console.log("yay, we're done!")
        getDocs()
      }).on('error', function (err) {
        console.log("boo, something went wrong!")
      });
}


document.getElementById("saveDoc").addEventListener("click", saveDoc);
document.getElementById("replicate").addEventListener("click", replicate);
document.getElementById("sync").addEventListener("click", sync);

window.onload = function(){
    getDocs()
};

//module.exports = localDB;