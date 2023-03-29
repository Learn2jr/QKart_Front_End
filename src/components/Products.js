
import { Search, SentimentDissatisfied } from "@mui/icons-material"; 
import { CircularProgress, Grid, InputAdornment, TextField, } from "@mui/material"; 
import { Box } from "@mui/system"; 

import axios from "axios"; 
import { useSnackbar } from "notistack"; 
import React, { useEffect, useState } from "react"; 
import { config } from "../App"; 
import Footer from "./Footer"; 
import Header from "./Header"; 
import ProductCard from "./ProductCard" 
// import Cart,{generateCartItemsFrom} from "./Cart"
 import "./Products.css";

 const Products = () => {

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

  const performAPICall = async () => {
    setLoading(true);
    try {
        await axios.get(
            `${config.endpoint}/products`
            ).then((
            response) => {
            setProducts(
                response
                .data
                );
            console.log(
                products
                )
                 setCartLoad(
                true
                );
        }).catch((
        error) => {
            enqueueSnackbar
                (error
                    .message, {
                        variant: "error"
                    });
        })
    } catch (error) {
        enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {
                variant: "error"
            });
    }
    setLoading(false);
};

useEffect(() => { 
  performAPICall();
 }, []); 

 useEffect(() => { 
  fetchCart(token); 
}, [cartLoad]);

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

const debounceSearch = (event,
  debounceTimeout) => {
  clearTimeout(debounceTimeout);
  const value = event.target
      .value;
  setSearchText(value);
  const newDebounceTimeout =
      setTimeout(() => {
          performSearch(
              value);
      }, 500);
  return newDebounceTimeout;
}; // Handle search bar input 
const handleSearch = (event) => {
  const newDebounceTimeout = debounceSearch(event,
      debounceTimeout);
  setDebounceTimeout(newDebounceTimeout);
};
const [debounceTimeout, setDebounceTimeout] = useState(null);

const fetchCart = async (token) => {
  if (!token) return;
  try { // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let response =
          await axios.get(
              `${config.endpoint}/cart`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
      if (response.status === 200) {
          //Update cartItems 
          setCartItems(generateCartItemsFrom(response.data,
              products));
      }
  } catch (e) {
      if (e.response && e.response.status === 400) {
          enqueueSnackbar(e.response.data.message, {
              variant: "error"
          });
      } else {
          enqueueSnackbar(
              "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.", {
                  variant: "error",
              });
      }
      return null;
  }
};

// const isItemInCart = (items, productId) => { let isIn =false; items.forEach((item)=>{ if(item.productId==productId) isIn=true; }); return isIn; };

const addToCart = async (token, items,
  products, productId, qty,
  options = {
      preventDuplicate: false
  }) => {
  if (token) {
      if (!isItemInCart(items,
              productId)) {
          addInCart(productId,
              qty);
      } else {
          enqueueSnackbar(
              "Item already in cart. Use the cart sidebar to update quantity or remove item.", {
                  variant: "warning",
              });
      }
  } else {
      enqueueSnackbar(
          "Login to add an item to the Cart", {
              variant: "warning",
          });
  }
};
let handleCart = (productId) => {
  addToCart(token, cartItems,
      products, productId, 1);
};
let handleQuantity = (productId,
  qty) => {
  addInCart(productId, qty);
};
let addInCart = async (productId,
  qty) => {
  try {
      let response =
          await axios.post(
              `${config.endpoint}/cart`, {
                  productId: productId,
                  qty: qty,
              }, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
          ); //Update cartItems 
      setCartItems(
          generateCartItemsFrom(
              response
              .data,
              products));
  } catch (e) {
      if (e.response && e
          .response.status ===
          400) {
          enqueueSnackbar(e
              .response
              .data
              .message, {
                  variant: "error"
              });
      } else {
          enqueueSnackbar(
              "Could not add to cart. Something went wrong.", {
                  variant: "error",
              });
      }
  }
};

return(
  <div>
   <Header>
      {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */} <TextField className="search-desktop" size="small" fullWidth InputProps={{ endAdornment: ( 
      <InputAdornment position="end">
         <Search color="primary" />
      </InputAdornment>
      ), }} placeholder="Search for items/categories" name="search" value={searchText} onChange={handleSearch} /> 
   </Header>
   {/* Search view for mobiles */} <TextField className="search-mobile" size="small" fullWidth InputProps={{ endAdornment: ( 
   <InputAdornment position="end">
      <Search color="primary" />
   </InputAdornment>
   ), }} placeholder="Search for items/categories" name="search" value={searchText} onChange={handleSearch} /> 
   <Grid container >
      <Grid item className="product-grid" >
         {/* xs={12} md={username?9:12} */} 
         <Box className="hero">
            <p className="hero-heading"> India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "} to your door step </p>
         </Box>
      </Grid>
      <Grid container>
         <Grid item xs={12} md={username?9:12}>
            {loading ? ( <Box style={{display: 'flex', flexDirection:"column",justifyContent:'center',alignItems:'center', width: "100%", height: "300px"}}> 
            <CircularProgress/>
            <p>Loading Products</p>
            </Box> ): ( debounceTimeout==null ? ( 
            <Grid container spacing={2} my={3}>
               { products.map((product)=>{ return( 
               <Grid item key={product["_id"]} xs={6} md={3}>
                  <ProductCard product={product} handleAddToCart={(event)=>
                  handleCart(product["_id"])} /> 
               </Grid>
               ) }) } 
            </Grid>
            ): (filteredProducts? (
            <Grid container spacing={2} my={3}>
               { filteredProducts.map((product)=>{ return( 
               <Grid item key={product["_id"]} xs={6} md={3}>
                  <ProductCard product={product} handleAddToCart={(event)=>
                  handleCart(product["_id"])} /> 
               </Grid>
               ) }) } 
            </Grid>
            ): ( <Box style={{display: 'flex', flexDirection:"column",justifyContent:'center',alignItems:'center', width: "100%", height: "300px"}}> 
            <SentimentDissatisfied />
            <h3>No products found</h3>
            </Box> ) ))} 
         </Grid>
         {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
          {username && <Grid item sx={{backgroundColor:"#E9F5E1", display: username !== "" ? "block" : "none"}} xs={12} md={3} > 
         {/* <Cart items={cartItems} products={products} handleQuantity={handleQuantity} /> */}
      </Grid>
      } 
   </Grid>
   </Grid><br/> 
   <Footer />
</div>
  )
      };
      export default Products;