import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import  CartContext  from "./CartContext";

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        if (existingItem.quantity >= product.countInStock) {
          toast.error("No more stock available.");
          return prevItems;
        }

        toast.success("Cart updated");

        return prevItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      if (product.countInStock <= 0) {
        toast.error("This product is out of stock.");
        return prevItems;
      }

      toast.success("Added to cart");

      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const decreaseFromCart = (productId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === productId);

      if (!existingItem) {
        return prevItems;
      }

      if (existingItem.quantity === 1) {
        toast.success("Removed from cart");
        return prevItems.filter((item) => item._id !== productId);
      }

      toast.success("Cart updated");

      return prevItems.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId),
    );

    toast.success("Removed from cart");
  };

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseFromCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
