const http = require('http');

const server = http.createServer((peticion, repuesta)=>{
    repuesta.end ('Hola Chuliannnnnn Ardaiz')
})


server.listen (8080, ()=>{
    console.log('Sintonizamossss');
});