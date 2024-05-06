const http = require('http')
const fs = require('fs')
const { error } = require('console')
const port = 3000

const server = http.createServer(function(req,res) {
    res.writeHead(200, {'Content-Type':'text/html'})
    fs.readFile('index.html', function(error, data) {
        if(error){
            res.writeHead(404)
            res.write('Error: Archivo no encontrado')
        } else {
            res.write(data)
        }
        res.end()
    })
})

server.listen(port, function(error) {
    if (error){
        console.log('Algo ha fallado.', error)
    } else {
        console.log('El servidor esta a la escucha en el puerto ' + port)
    }
})