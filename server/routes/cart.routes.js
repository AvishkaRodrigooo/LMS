// routes/cart.routes.js
import express from 'express';
import { 
  getCart, 
  addToCart, 
  removeFromCart,
  createCheckoutSession 
} from '../controllers/cart.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.use(isAuthenticated);

router.route('/')
  .get(getCart)
  .post(addToCart);

router.route('/:courseId')
  .delete(removeFromCart);

  router.route('/create-checkout-session')
  .post(isAuthenticated, createCheckoutSession);

export default router;