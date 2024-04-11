// import Product from "../models/product";
// import User from " ../models/user";
import Cart from "../models/cart";
import { StatusCodes } from "http-status-codes";

export const getCartByUserId = async (req, res) => {
    // Get /cart/:userId
    const {userId} = req.params;
    try {
        const cart = await Cart.findOne({userId}).populate("products.productId");
        // cart : {userId: 1, products: [{productId: Schema.Types.ObjectId,  ref('Product'), quantity: 2}]}
        const cartData = {
            products: cart.products.map((item) => ({
                productId: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                quantity: item.quantity
            }))
        }
        return res.status(StatusCodes.OK).json(cartData);
    } catch (error) {
        
    }
}
export const addItemToCart = async (req, res) => {
    const { userId, productId, quantity} = req.body;
    try {
        // Kiểm tra giỏ hàng có tồn tại chưa? dựa theo UserId
        let cart = await Cart.findOne({userId});
        // Nếu giỏ hàng không tồn tại thì chúng ta tạo mới giỏ hàng
        if (!cart) {
            cart = new Cart({userId, products: []});
        }
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng không
        const existProductIndex = cart.products.findIndex(
            (item)=> item.productId == productId
        );
        if (existProductIndex !== -1) {
            // nếu mà sản phẩm tồn tại thì cập nhật số lượng
            cart.products[existProductIndex].quantity += quantity;
        }else{
            // nếu sản phẩm chưa có trong giỏ hàng thì chúng ta thêm mới
            cart.products.push({productId, quantity});
        }
        // lưu giỏ hàng
        await cart.save();
        return res.status(StatusCodes.OK).json({cart});
    } catch (error) {
        // trả về client lỗi
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Internal Server Error"
        })
    }
}

export const removeFromCart = async (req, res) => {
    const {userId, productId} = req.body;
    try {
        let cart = await Cart.findOne({userId});
        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({error: "Cart not found"});
        }
        cart.products = cart.products.filter(
            (product) => product.productId && product.productId.toString() !== productId
        );

        await cart.save();
        return res.status(StatusCodes.OK).json({ cart })
    } catch (error) {
        // trả về client lỗi
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Internal Server Error"
        })
    }
}

export const updateProductQuantity = async(req, res) => {
    const {userId, productId, quantity} = req.body;
    try {
        let cart = await Cart.findOne({userId});
    if (!cart) {
        return res.status(StatusCodes.NOT_FOUND).json({error: "Cart not found"});
    }
    const product = cart.products.find(item => item.productId.toString() === productId);
    if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({error: "Product not found"});
    }
    product.quantity = quantity;
    await cart.save();
    return res.status(StatusCodes.OK).json({cart});
    } catch (error) {
        // trả về client lỗi
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Internal Server Error"
        })
    }
}

// Tăng số lượng của sản phẩm trong giỏ hàng
export const increaseProductQuantity = async (req,res) => {
    const {userId, productId} = req.body;
    try {
        let cart = await Cart.findOne({userId});
        if (!cart) {
            return res.status(404).json({message: "Cart not found"});
        }
        const product = cart.products.find((item) => item.productId.toString() === productId);
        if (!product) {
            return res.status(404).json({message: "Product not found in cart"})
        }
        product.quantity++;
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Giảm số lượng của sản phẩm trong giỏ hàng
export const decreaseProductQuantity = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const product = cart.products.find((item) => item.productId.toString() === productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (product.quantity > 1) {
            product.quantity--;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};