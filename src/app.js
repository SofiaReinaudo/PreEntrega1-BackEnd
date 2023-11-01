import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import { PORT } from './utils.js'
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
import viewsRouter from './router/views.router.js'


const app = express()
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))


const httpServer = app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))
httpServer.on('error', err => console.log(`Express server error: ${err.message}`))

const io = new Server(httpServer)

app.set('socketio', io)
/* app.use((req, res, next) => {
    req.io = io
    next()
}) */

app.use(express.static(__dirname + "/public"))
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', `${__dirname}/views`)


app.get('/', (req, res) => res.status(200).render('index'))
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
// app.use('/products', viewsRouter)
app.use('/home', viewsRouter)


io.on('connection', socket => {
    console.log('New client connected to the Server')
    socket.on('productList', data => {
        io.emit('updatedProducts', data)
    })
})