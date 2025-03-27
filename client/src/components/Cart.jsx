import { useGetCartQuery, useRemoveFromCartMutation } from "@/features/api/cartApi";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Cart = () => {
  const { data: cartData, isLoading, error } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();

  // Debug logging
  useEffect(() => {
    console.log('Full Cart Data:', cartData);
  }, [cartData]);
  
  const handleRemove = async (courseId) => {
    try {
      await removeFromCart(courseId).unwrap();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  if (isLoading) return <div>Loading cart...</div>;

  if (error) return <div>Error loading cart: {error.toString()}</div>;

  // Handle case when cart is undefined or has no items
  if (!cartData?.cart?.items || cartData.cart.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6"> Shopping Cart</h1>
      
      <div className="space-y-4">
        {cartData.cart.items.map((item) => {
          const course = item.courseId;
          
          return (
            <div 
              key={course._id} 
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={course.courseThumbnail || '/placeholder-course.jpg'} 
                  alt={course.courseTitle || 'Course Image'}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{course.courseTitle || 'Untitled Course'}</h3>
                  <p className="text-gray-600">
                    LKR {Number(course.coursePrice || 0).toFixed(2)}
                  </p>
                </div>
              </div>
              <Button 
                variant="destructive"
                onClick={() => handleRemove(course._id)}
              >
                Remove
              </Button>
            </div>
          );
        })}
        
        <div className="mt-6 flex justify-end">
          <Link 
            to="/checkout"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;