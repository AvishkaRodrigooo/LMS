import { Button } from "@/components/ui/button";
import { useAddToCartMutation } from "@/features/api/cartApi";
import { Loader2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom"; // Add this import

const AddToCartButton = ({ courseId, ...props }) => {
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const navigate = useNavigate(); 

  const handleAddToCart = async () => {
    try {
      await addToCart(courseId).unwrap();
      navigate("/Cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;