import React, { useMemo } from 'react';
import { useGetCartQuery, useCreateCheckoutSessionMutation } from "@/features/api/cartApi";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const { 
    data: cartData, 
    isLoading: isCartLoading, 
    error: cartError 
  } = useGetCartQuery();

  const [createCheckoutSession, { 
    isLoading: isCheckoutLoading 
  }] = useCreateCheckoutSessionMutation();

  const totalPrice = useMemo(() => {
    return cartData?.cart?.items?.reduce((sum, item) => {
      return sum + (item.courseId?.coursePrice || 0);
    }, 0) || 0;
  }, [cartData]);

  const handleCheckout = async () => {
    try {
      const { data } = await createCheckoutSessionMutation();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error details:', error);
      
      if (error.data?.messages) {
        error.data.messages.forEach(msg => {
          console.error('Specific Error:', msg);
          toast.error(msg);
        });
      } else if (error.data?.error) {
        console.error('Error:', error.data.error);
        toast.error(error.data.error);
      } else {
        toast.error("Checkout process failed");
      }
    }
  };

  if (isCartLoading) return <div>Loading cart...</div>;
  if (cartError) return <div>Error loading cart: {cartError.message}</div>;

  if (!cartData?.cart?.items?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link to="/courses" className="text-blue-600 hover:underline">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          {cartData.cart.items.map((item) => {
            if (!item.courseId) {
              console.error('Invalid cart item:', item);
              return null;
            }

            return (
              <div 
                key={`${item._id}-${item.courseId._id}`}
                className="flex justify-between items-center mb-4 pb-4 border-b"
              >
                <div className="flex items-center">
                  <img 
                    src={item.courseId.courseThumbnail || '/default-course-image.png'} 
                    alt={item.courseId.courseTitle || 'Course'}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{item.courseId.courseTitle || 'Unnamed Course'}</h3>
                    <p className="text-gray-600">USD {(item.courseId.coursePrice || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-between font-bold text-xl mt-4">
            <span>Total:</span>
            <span>USD {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Payment</h2>
          <Button 
            onClick={handleCheckout}
            className="w-full"
            size="lg"
            disabled={isCheckoutLoading}
          >
            {isCheckoutLoading ? "Processing..." : "Secure Checkout"}
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            All transactions are secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;