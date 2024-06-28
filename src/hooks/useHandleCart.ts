import { CartItem } from "@/@types/cart.type";
import { useAppContext } from "@/context/app.context";
import { useCartStore } from "@/stores/cart.store";
import { getLocalProductCart, setLocalProductToCart } from "@/utils/auth";
import { convertAddProduct } from "@/utils/helper";
import { cloneDeep } from "lodash";

export default function useHandleCart() {
  const { cart, updateCart } = useCartStore();
  const { user } = useAppContext();

  const onType = (id: string, value: number) => {
    const increasingItem = cart.find((item) => item.product == id);
    let cloneItem = cloneDeep(increasingItem);
    const cartLS = getLocalProductCart();
    const parseCart = cartLS ? JSON.parse(cartLS) : {};
    const cartConverted = convertAddProduct(
      cart,
      {
        ...cloneItem,
        amount: value,
      } as CartItem,
      true
    );
    updateCart(cartConverted);
    if (user?._id) {
      setLocalProductToCart({ ...parseCart, [user._id]: cartConverted });
    }
  };

  const onDecrease = (id: string, value: number) => {
    const increasingItem = cart.find((item) => item.product == id);
    let cloneItem = cloneDeep(increasingItem);
    const cartLS = getLocalProductCart();
    const parseCart = cartLS ? JSON.parse(cartLS) : {};
    const cartConverted = convertAddProduct(cart, {
      ...cloneItem,
      amount: -1,
    } as CartItem);
    updateCart(cartConverted);
    if (user?._id) {
      setLocalProductToCart({ ...parseCart, [user._id]: cartConverted });
    }
  };

  const onIncrease = (id: string, value: number) => {
    const increasingItem = cart.find((item) => item.product == id);
    let cloneItem = cloneDeep(increasingItem);
    const cartLS = getLocalProductCart();
    const parseCart = cartLS ? JSON.parse(cartLS) : {};
    const cartConverted = convertAddProduct(cart, {
      ...cloneItem,
      amount: 1,
    } as CartItem);
    updateCart(cartConverted);
    if (user?._id) {
      setLocalProductToCart({ ...parseCart, [user._id]: cartConverted });
    }
  };
  return { onDecrease, onIncrease, onType };
}
