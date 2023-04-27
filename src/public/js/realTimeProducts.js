const socket = io()
const formulario = document.getElementById('formulario')

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
                    <button class="eliminar-producto" data-product-id="${producto.id}">Eliminar producto</button>
                </div>`
    });
    products.innerHTML=productos
    
})


formulario.addEventListener('submit', (event) =>{
    event.preventDefault()
    
    const data = Object.fromEntries(new FormData(event.target))
    data['thumbnail'] = ['empty']
    data['status'] = [true]
/*     console.log(data); */
    
    socket.emit('product', data)
    
})

$(document).on('click', '.eliminar-producto', function(event) {
    event.preventDefault();
    const productId = $(this).data('product-id');
/*     console.log(productId); */
    socket.emit('product_delete', productId);
});





