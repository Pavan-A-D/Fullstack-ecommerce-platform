const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");
const upload = require("../middleware/upload");

// GET /api/products       — public
// POST /api/products      — admin (image upload)
router
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.single("image"), createProduct);

// GET /api/products/:id   — public
// PUT /api/products/:id   — admin
// DELETE /api/products/:id — admin
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
