import { Router } from 'express'
import { cartManager } from '../controllers/CartManager.js'

const router = Router()

// ----------- Routes / endpoints API REST -------------

// -----------------------------------------------------
//             POST routing process
// -----------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const addCart = await cartManager.addCart()
    res.json({ message: 'Product added to cart', addCart })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid)
    const productId = parseInt(req.params.pid)

    if (productId <= 0) {
      return res.status(404).json({ error: "Invalid product" })
    }
    const cart = await cartManager.addProductsToCart(cartId, productId)

    if (!cart) {
      return res.status(404).json({ error: `The cart with id ${cartId} does not exist` })
    }
    res.status(200).json(cart)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// -----------------------------------------------------
//             GET routing process
// -----------------------------------------------------
router.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid)
    const cart = await cartManager.getCartsById(cartId)

    if (!cart) {
      return res.status(404).json({ error: `The cart with id ${cartId} does not exist` })
    }
    res.status(200).send(cart)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

export default router