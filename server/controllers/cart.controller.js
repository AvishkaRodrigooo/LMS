import { Cart } from "../models/cart.model.js";
import { Course } from "../models/course.model.js";
import Stripe from "stripe";
import { CoursePurchase } from "../models/coursePurchase.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
  maxNetworkRetries: 3
});

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.id })
      .populate({
        path: "items.courseId",
        select: "courseTitle coursePrice courseThumbnail"
      });
      
    return res.status(200).json({
      success: true,
      cart: cart || { items: [] }
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error retrieving cart",
      error: error.message 
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    // Validate course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    // Check if course is already purchased
    const existingPurchase = await CoursePurchase.findOne({ 
      userId: req.id, 
      courseId, 
      status: "completed" 
    });

    if (existingPurchase) {
      return res.status(400).json({ 
        success: false, 
        message: "Course is already purchased" 
      });
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: req.id },
      { $addToSet: { items: { courseId } } },
      { new: true, upsert: true }
    ).populate("items.courseId");

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error adding to cart",
      error: error.message 
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const cart = await Cart.findOneAndUpdate(
      { userId: req.id },
      { $pull: { items: { courseId } } },
      { new: true }
    ).populate("items.courseId");

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error removing from cart",
      error: error.message 
    });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const currency = 'usd'; // Changed to USD for broader support

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.courseId",
        select: "courseTitle coursePrice courseThumbnail _id status",
        match: { status: 'published' }
      });

    if (!cart?.items?.length) {
      return res.status(400).json({
        success: false,
        messages: ["Your cart is empty"]
      });
    }

    const validCourses = [];
    const errorMessages = [];

    for (const item of cart.items) {
      const course = item.courseId;
      
      if (!course) {
        errorMessages.push("Invalid course found in cart");
        continue;
      }

      if (course.status !== 'published') {
        errorMessages.push(`"${course.courseTitle}" is no longer available`);
        continue;
      }

      const existingPurchase = await CoursePurchase.findOne({
        userId,
        courseId: course._id,
        status: "completed"
      });

      if (existingPurchase) {
        errorMessages.push(`"${course.courseTitle}" is already purchased`);
        continue;
      }

      validCourses.push({
        ...course.toObject(),
        price: Math.round(course.coursePrice * 100) // Convert to cents
      });
    }

    if (errorMessages.length > 0) {
      return res.status(400).json({
        success: false,
        messages: errorMessages
      });
    }

    if (validCourses.length === 0) {
      return res.status(400).json({
        success: false,
        messages: ["No valid courses available for purchase"]
      });
    }

    const lineItems = validCourses.map(course => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: course.courseTitle,
          images: course.courseThumbnail ? 
            [course.courseThumbnail] : 
            [`${process.env.CLIENT_URL}/images/default-course.png`],
        },
        unit_amount: course.price,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: { 
        userId: userId.toString(),
        courses: JSON.stringify(validCourses.map(c => c._id))
      },
      expires_at: Math.floor(Date.now() / 1000) + 1800 // 30 minutes
    });

    await CoursePurchase.insertMany(
      validCourses.map(course => ({
        courseId: course._id,
        userId,
        amount: course.coursePrice,
        status: "pending",
        paymentId: session.id,
        sessionExpiry: new Date(session.expires_at * 1000)
      }))
    );

    return res.status(200).json({ 
      success: true, 
      url: session.url 
    });

  } catch (error) {
    console.error("Checkout Error:", error);

    return res.status(500).json({
      success: false,
      messages: [error.message || "Payment processing failed"],
      error: error.toString()
    });
  }
};