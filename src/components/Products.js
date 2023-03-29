import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard"
import Cart,{generateCartItemsFrom} from "./Cart"
import "./Products.css";



// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
* @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {

  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  let token=localStorage.getItem("token");
  let username=localStorage.getItem("username");
  let balance=localStorage.getItem("balance");
   const [products, setProducts] = useState([]);
   const [filteredProducts, setFilteredProducts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [searchText, setSearchText] = useState("");
   const [cartItems,setCartItems]=useState([]);
   const [cartLoad,setCartLoad]=useState(null);
 
   const { enqueueSnackbar } = useSnackbar();
 
   // Make API call to get the products list and store it to display the products
   
     
   
 
   
  const performAPICall = async () => {
    setLoading(true);
    try{
      await axios.get(`${config.endpoint}/products`).then((response)=>{
        setProducts(response.data);
        console.log(products)
        setCartLoad(true);
      }).catch((error)=>{
        enqueueSnackbar(error.message, { variant: "error" });
      })
    }
    catch (error) {
      enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", { variant: "error" });
      }
      setLoading(false);
    };
  useEffect(() => {
    performAPICall();
  }, []);
  useEffect(() => {
    fetchCart(token);
  }, [cartLoad]);
  

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setFilteredProducts(response.data);
    } catch (error) {
      console.error(error);
      setFilteredProducts(null);
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout);
    const value = event.target.value;
    setSearchText(value);
    const newDebounceTimeout = setTimeout(() => {
      performSearch(value);
    }, 500);
    return newDebounceTimeout;
  };
  // Handle search bar input
  const handleSearch = (event) => {
    const newDebounceTimeout = debounceSearch(event, debounceTimeout);
    setDebounceTimeout(newDebounceTimeout);
  };

  
  const [debounceTimeout, setDebounceTimeout] = useState(null);





  


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        //Update cartItems
        setCartItems(generateCartItemsFrom(response.data, products));
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let isIn =false;
    items.forEach((item)=>{
      if(item.productId==productId) isIn=true;
    });
    return isIn;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (token) {
      if (!isItemInCart(items, productId)) {
        addInCart(productId, qty);
      } else {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          {
            variant: "warning",
          }
        );
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
  };

  let handleCart = (productId) => {
    addToCart(token, cartItems, products, productId, 1);
  };
  let handleQuantity = (productId, qty) => {
    addInCart(productId, qty);
  };
  let addInCart = async (productId, qty) => {
    try {
      let response = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId: productId,
          qty: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //Update cartItems
      setCartItems(generateCartItemsFrom(response.data, products));
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not add to cart. Something went wrong.", {
          variant: "error",
        });
      }
    }
  };


  return (
    <div>
       <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className="search-desktop"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchText}
        onChange={handleSearch}
      />
       
       
       </Header>

       {/* Search view for mobiles */}
     <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchText}
        onChange={handleSearch}
      />
       <Grid container >
         <Grid item className="product-grid" > 
         {/* xs={12} md={username?9:12}  */}
           <Box className="hero">
             <p className="hero-heading">
               India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
            
           
           </Box>
           
            
            
           
           
       
         </Grid>
        
         
         
         <Grid container>
          
          <Grid item xs={12} md={username?9:12}>
            
         {loading ? (
          <Box style={{display: 'flex', flexDirection:"column",justifyContent:'center',alignItems:'center', width: "100%", height: "300px"}}>          
          <CircularProgress/>         
           <p>Loading Products</p>          
           </Box>         ): 
           ( debounceTimeout==null ? (
          <Grid container spacing={2} my={3}>             
           {
                  products.map((product)=>{
                    return(
                    <Grid item key={product["_id"]} xs={6} md={3}>                     
                     <ProductCard  product={product} handleAddToCart={(event)=>handleCart(product["_id"])}
                    />                    
                    </Grid>)
                  })
                }
              </Grid>              
              ):
              (filteredProducts?
              (<Grid container spacing={2} my={3}>             
           {
                  filteredProducts.map((product)=>{
                    return(
                    <Grid item key={product["_id"]} xs={6} md={3}>                     
                     <ProductCard product={product}
                     handleAddToCart={(event)=>handleCart(product["_id"])}
                    />                    
                    </Grid>                    )
                  })
                }
              </Grid> ):
              (
                <Box style={{display: 'flex', flexDirection:"column",justifyContent:'center',alignItems:'center', width: "100%", height: "300px"}}>               
                 <SentimentDissatisfied />                
                 <h3>No products found</h3>              
                 </Box>              
                 )
         ))}
         
         
         </Grid>
         
          
        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
       {username && <Grid item sx={{backgroundColor:"#E9F5E1", display: username !== "" ? "block" : "none"}}  xs={12} md={3}  >
              <Cart
              items={cartItems}
              products={products}
              handleQuantity={handleQuantity}
            /></Grid>} 
         </Grid>
         
         
         
       </Grid><br/>
       
       
       
       
      <Footer />
    </div>
  );
};

export default Products;
