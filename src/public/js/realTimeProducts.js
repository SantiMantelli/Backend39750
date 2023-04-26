const socket = io()

const formulario = document.getElementById('formulario')

/* // Realiza una solicitud GET para obtener los productos
fetch('/api/products')
.then(response => response.json())
.then(data => {
    let productos = ''
    data.data.forEach(producto => {
        productos += `<div class="producto"> 
                    <h1>title:${producto.title}</h1><br>
                    description:${producto.description}<br>
                    price:${producto.price}<br>
                    status:${producto.status}<br>
                    category:${producto.category}<br>
                    thumbnail:${producto.thumbnail}<br>
                    code:${producto.code}<br>
                    stock:${producto.stock}<br>
                    id:${producto.id}<br>
                </div>`
    });
    products.innerHTML = productos;
    
    // Conecta el socket después de mostrar los productos
    const socket = io();
    socket.on('products', data =>{
        let productos = ''
        data.data.forEach(producto => {
            productos += `<div class="producto"> 
                        <h1>title:${producto.title}</h1><br>
                        description:${producto.description}<br>
                        price:${producto.price}<br>
                        status:${producto.status}<br>
                        category:${producto.category}<br>
                        thumbnail:${producto.thumbnail}<br>
                        code:${producto.code}<br>
                        stock:${producto.stock}<br>
                        id:${producto.id}<br>
                    </div>`
        });
        products.innerHTML=productos
    })
});
 */


socket.on('products', data =>{
    
    let productos = ''
    data.data.forEach(producto => {
        productos += `<div class="producto"> 
                    <h1>${producto.title}</h1><br>
                    <ul>
                        <li><b>Descripcion: </b>${producto.description}</li>
                        <li><b>Precio: </b>${producto.price}</li>
                        <li><b>Estado: </b>${producto.status}</li>
                        <li><b>Categoria: </b>${producto.category}</li>
                        <li><b>Foto: </b>${producto.thumbnail}</li>
                        <li><b>Codigo: </b>${producto.code}</li>
                        <li><b>Stock: </b>${producto.stock}</li>
                        <li><b>Id: </b>${producto.id}</li>
                    </ul>
                </div>`
    });
    products.innerHTML=productos
    
})


formulario.addEventListener('submit', (event) =>{
    event.preventDefault()
    
    const data = Object.fromEntries(new FormData(event.target))
    data['thumbnail'] = ['empty']
    console.log(data);
    
    socket.emit('product', data)
    
})


