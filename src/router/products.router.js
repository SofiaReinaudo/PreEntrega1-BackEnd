import { Router } from 'express'
import { productManager } from '../controllers/ProductManager.js'

const router = Router()
const products = await productManager.getProducts()

// ----------- Routes / endpoints API REST -------------

// -----------------------------------------------------
//             GET routing process
// -----------------------------------------------------
router.get('/', (req, res) => {
  try {
    const limit = req.query.limit
    if (limit === undefined) {
      return res.status(200).json({ products })
    } else if (isNaN(limit) || limit < 1 || limit > products.length) {
      return res.status(400).json({ message: 'Limit is invalid' })
    } 
    const limitedProducts = products.slice(0, limit)
    res.status(200).json(limitedProducts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid) 
    if (isNaN(productId)) return res.status(400).json({ error: 'Product id must be a number' })
    // const product = products.find(item => item.id == pid)
    const product = await productManager.getProductsById(productId)
    if (!product) return res.status(404).json({ error: `The product with id ${productId} is not found` })
    return res.status(200).json({ product })
} catch (err) {
    res.status(500).json({ error: err.message })
}
})

// -----------------------------------------------------
//             POST routing process
// -----------------------------------------------------
router.post('/', async (req, res) => {
  try {
    let { title, description, price, thumbnail, code, category, stock, status } = req.body
    if ( !title || !description || !code || !price || !stock || !category ) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    const addProduct = await productManager.addProduct( title, description, price, thumbnail, code, category, stock, (status = true) )
    if (addProduct) return res.status(201).json({ message: `Product with id ${addProduct.id} added successfully`, product: addProduct })
    return res.status(404).json({ error: 'Error adding product' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// -----------------------------------------------------
//             PUT routing process
// -----------------------------------------------------
router.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid)
    if (req.body.id !== productId && req.body.id !== undefined) {
      return res.status(404).json({ error: 'Cannot modify product id' })
    }
    const updated = req.body
    const productFind = await products.find(item => item.id === productId)
    if (!productFind) {
      return res.status(404).json({ error: `The product with id ${productId} does not exist` })
    }
    await productManager.updateProduct(productId, updated)
    res.status(200).json({ message: `Successful update of product with id ${productId}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// -----------------------------------------------------
//             DELETE routing process
// -----------------------------------------------------
router.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid)
    const productFind = await products.find(item => item.id === productId)
    if (!productFind) {
      return res.status(404).json({ error: `The product with id ${productId} does not exist` })
    }
    const deleteProduct = await productManager.deleteProduct(productId)
    console.log(deleteProduct)
    res.status(200).json({ message: `Product with id ${productId} removed successfully` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router