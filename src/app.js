import express from "express"
import productsRouter from "./router/products.router.js"
import cartsRouter from "./router/carts.router.js"

const app = express()
app.use(express.json())

app.get("/", (req, res) => res.status(200).json({ message: "Server Ok" }))


// -----------------------------------------------
//         Products and Carts APIs
// -----------------------------------------------
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)


// -----------------------------------------------
//         Listen Server Express
// -----------------------------------------------
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))
server.on('err', err => console.log(`Express server error: ${err.message}`))