import React from "react";
import { Fragment, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Pagination from "@mui/material/Pagination";

import {  sortOptions } from "./FilterData";
import ProductCard from "../ProductCard/ProductCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { productdata } from "../../../../data";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  findProducts,
  findProductsByCategory,
  findProductsbyPrice,
} from "../../../../Redux/Customers/Product/Action";
import { deepPurple } from "@mui/material/colors";
import { Backdrop, Box, Button, CircularProgress, Grid, Skeleton, TextField, Typography } from "@mui/material";
import BackdropComponent from "../../BackDrop/Backdrop";
import { receiveProducts, receiveProductsSearch } from "../../../../action";
import HomeProductCard from "../../Home/HomeProductCard";
import { debounce, throttle } from 'lodash';
import { API_BASE_URL } from "../../../../config/api";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  // State for managing mobile filters visibility
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // React router hooks for navigation, dispatching actions, and accessing parameters
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const location = useLocation();

  // State for storing JWT token, loader visibility, products, search value, and filters
  const jwt = localStorage.getItem("jwt");
  const [isLoaderOpen, setIsLoaderOpen] = useState(!false);
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [priceChange,setPriceChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleFilter,setSinglefilter] = useState([])
  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const colorValue = searchParams.get("color");
  const sizeValue = searchParams.get("size");
  const price = searchParams.get("price");
  const disccount = searchParams.get("disccout");
  const sortValue = searchParams.get("sort");
  const pageNumber = searchParams.get("page") || 1;
  const stock = searchParams.get("stock");

  // Closing the loader
  // const handleLoderClose = () => {
  //   setIsLoaderOpen(false);
  // };

  // Handling sort change and updating URL
  const handleSortChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };
// filter data component
const fetchfilters = () => {
  fetch(`${API_BASE_URL}filters/portmans`).then((response) => {
    return response.json();
  }).then((res)=>{
    console.log(res)
    setSinglefilter(res.filters)}).catch((err)=>{console.log(err)})
}
useEffect(()=>{
  fetchfilters()
},[])
  // Handling pagination change and updating URL
  const handlePaginationChange = (event, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // Fetching products based on filters, sorting, and pagination from URL parameters
  useEffect(() => {
    const [minPrice, maxPrice] = price === null ? [0, 0] : price.split("-").map(Number);
    if(price){
      handlePriceMinMax()
    }else{
      const data = {
        category: param.lavelThree,
        colors: colorValue || [],
        sizes: sizeValue || [],
        minDiscount: disccount || 0,
        sort: sortValue || "price_low",
        pageNumber: pageNumber,
        pageSize: 10,
        stock: stock,
      };
      dispatch(findProducts(data));
    }
    
    console.log(1)
  }, [param.lavelThree, colorValue, sizeValue, disccount, sortValue, pageNumber, stock]);

  // Initial fetch of products without filters
  useEffect(() => {
    receiveProducts(setLoading).then((data) => {
      setProducts(data.hits);
      setSearchProducts(data.hits);
    });
  }, []);

  // Handling checkbox filter change and updating URL
  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValues = searchParams.getAll(sectionId);

    if (filterValues.length > 0 && filterValues[0].split(",").includes(value)) {
      filterValues = filterValues[0].split(",").filter((item) => item !== value);
      if (filterValues.length === 0) {
        searchParams.delete(sectionId);
      }
    } else {
      filterValues.push(value);
    }

    if (filterValues.length > 0) searchParams.set(sectionId, filterValues.join(","));
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // Handling radio button filter change and updating URL
  const handleRadioFilterChange = (e, sectionId) => {
    setSearchValue(e.target.value);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(sectionId, e.target.value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // Updating loader state based on product loading state
  // useEffect(() => {
  //   if (customersProduct.loading) {
  //     setIsLoaderOpen(true);
  //   } else {
  //     setIsLoaderOpen(false);
  //   }
  // }, [customersProduct.loading]);

  // Handling price range filter and updating products and URL
  const handlePriceMinMax = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("price", `${min}-${max}`);
    const query = searchParams.toString();

    dispatch(findProductsbyPrice({ minPrice: min, maxPrice: max }))
      .then(data => {
        console.log(data, 'data')
        setProducts(data.hits);
        setSearchProducts(data.hits);
        setMax(()=>null)
        setMin(()=>null)
        console.log(min,max)
        alert("filter applied successfully")
      })
      .catch(error => {
        setSearchProducts(null)
        setMax(()=>null)
        setMin(()=>null)
        console.error('Error retrieving products:', error);
      });
     
    // navigate({ search: `?${query}` });
  };
// useEffect(()=>{
//   handlePriceMinMax()
// },[price])
  // Updating search value state
  const TextFielData = (e) => {
    setSearchValue(e.target.value);
  };

  // Debounced search input to limit API calls while typing
  const debouncedSearch = debounce((value) => {
    if (value) {
      receiveProductsSearch(value).then((data) => {
        setSearchProducts(data.hits);
      });
    } else {
      setSearchProducts(products);
    }
  }, 500);

  // Calling debounced search function with current search value
  useEffect(() => {
    debouncedSearch(searchValue);
    console.log(2)
  }, [searchValue]);


  
  // console.log(products, searchProducts)
  return (
    <div className="bg-white -z-20 ">
      <div>

        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-5 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                  </div>


                  {/* Filters */}


                  <form className="mt-4 border-t border-gray-200">
                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>

                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">

                                {section.children.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      onChange={() =>
                                        handleFilter(option.value, section.id)
                                      }
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    // onClick={()=>handleFilter(option.value,section.id)}
                                    >
                                      {option.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto px-4 lg:px-14 ">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900
            mt-8">
              Products
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <p
                              onClick={() => handleSortChange(option.query)}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm cursor-pointer"
                              )}
                            >
                              {option.name}
                            </p>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-2 pt-1">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div>
              <h2 className="py-5 font-semibold opacity-60 text-lg">Filters</h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
                <form className="hidden lg:block border rounded-md p-5 ">
                  <Box
                    sx={{
                      // border: '1px solid #ccc',
                      zIndex: 10000,
                      padding: 0.5,
                      backgroundColor: 'white',
                      borderRadius: 2,
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Improved shadow
                      width: 'fit-content',
                      maxWidth: '100%', // Added to ensure responsiveness
                    }}
                  >
                    <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1, color: '#333', }}> {/* Improved text color */}
                      Price 
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={5}> {/* Adjusted grid size for better responsiveness */}
                        <input
                          onChange={(e)=>setMin(e.target.value)}
                          value={min}
                          type="text"
                          inputmode="numeric"
                          placeholder="Min"
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                            boxSizing: 'border-box',
                            appearance: 'textfield'
                          }}
                        />
                      </Grid>
                      <span style={{textAlign:'center',marginLeft:'10px',marginTop:'10px'}}>To</span>
                      <Grid item xs={12} sm={5}> {/* Adjusted grid size for better responsiveness */}
                        <input
                          onChange={(e)=>setMax(e.target.value)}
                          value={max}
                          type="text"
                          inputmode="numeric"
                          placeholder="Max"
                          style={{
                            border:'1px solid green',
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                            boxSizing: 'border-box',
                            appearance: 'textfield'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}> {/* Adjusted grid size for better responsiveness */}
                        <Button
                          onClick={handlePriceMinMax}
                          variant="contained"
                          color="primary"
                          size="medium"
                          sx={{ textTransform: 'none', borderRadius: '4px', width: '100%' }} // Improved button width
                        >
                          Go
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  {singleFilter?.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <FormControl>
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="female"
                                name="radio-buttons-group"
                              >
                                {section?.children?.map((option, optionIdx) => (
                                  <FormControlLabel
                                    value={option.name}
                                    control={<Radio />}
                                    label={option.name}
                                    onChange={(e) =>
                                      handleRadioFilterChange(e, section.name)
                                    }
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>

                {/* Product grid */}
                <div className="lg:col-span-4 w-full ">
                  <Grid item xs={12} mb={2}>
                    <TextField
                      required
                      id="Search"
                      name="Search"
                      label="Search Here..."
                      fullWidth
                      autoComplete="given-name"
                      type="text"
                      onChange={(e) => {
                        TextFielData(e);
                      }}
                    />
                  </Grid>
                  <div className="flex flex-wrap justify-center bg-white border py-5 rounded-md ">

                    {loading ? <Skeleton variant="rectangular" width='100%' height={500} /> : <>
                    {searchProducts?<>{
                        searchProducts?.map((item) => (
                          <div className="w-[15rem] border m-3 transition-all cursor-pointer hover:scale-105">
                            <HomeProductCard product={item} />
                          </div>
                        ))}</>:<h1>No Products Found</h1>}
                      
                    </>
                    }
                    {/* <ProductCard product={products} /> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* pagination section */}
        <section className="w-full px-[3.6rem]">
          <div className="mx-auto px-4 py-5 flex justify-center shadow-lg border rounded-md">
            <Pagination
              count={5}
              color="primary"
              className=""
              onChange={handlePaginationChange}
            />
          </div>
        </section>

        {/* {backdrop} */}
        <section>
          <BackdropComponent open={false} />
        </section>
      </div>
    </div>
  );
}
