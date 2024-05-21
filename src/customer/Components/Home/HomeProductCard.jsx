// import React from "react";
// import { useNavigate } from "react-router-dom";

// const HomeProductCard = ({ product }) => {
//   const navigate = useNavigate();

//   // Calculate discount percentage
//   const calculateDiscount = () => {
//     const originalPrice = parseFloat(product?.price[0]?.value);
//     const offerPrice = parseFloat(product?.price[1]?.value);
//     const discount = ((originalPrice - offerPrice) / originalPrice) * 100;
//     return Math.round(discount);
//   };

//   return (
//     <div
//       onClick={() => navigate(`/product/${product?.uniqueID}`)}
//       className="relative h-[25rem] cursor-pointer flex flex-col border rounded-lg shadow-lg overflow-hidden w-45  p-4 transition-transform transform hover:-translate-y-2 hover:shadow-xl"
//     >
//       <div className="relative ">
//         <img
//           src={product?.images[0]?.thumbnail || product?.thumbnail}
//           alt={product?.name}
//           className="w-full h-50 object-contain rounded-t-lg transition-opacity hover:opacity-80"
//           onMouseOver={(e) =>
//             (e.currentTarget.src =
//               product?.images[0]?.fullImageRaw || product?.fullImage)
//           }
//           onMouseOut={(e) =>
//             (e.currentTarget.src = product?.images[0]?.thumbnail || product?.thumbnail)
//           }
//         />
//         {calculateDiscount() > 0 && (
//           <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
//             {calculateDiscount()}% OFF
//           </span>
//         )}
//       </div>
//       <div className="flex flex-col justify-between flex-grow mt-4">
//         <h3 className="text-lg text-center font-semibold text-gray-900 ">
//           {product?.name}
//         </h3>
//         <div className="flex justify-around items-center mt-2">
//           {/* <span className="text-gray-600 text-sm">
//             <del>${product?.price[0]?.value}</del>
//           </span> */}
//           <span className="text-purple-600 font-bold text-sm">
//             $ {product?.price[1]?.value}
//           </span>
//         </div>
//         {/* <div className="mt-2 text-sm text-gray-700">
//           <p className="truncate">{product?.shortDescription}</p>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default HomeProductCard;




import React from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import { Box } from "@mui/material";

const HomeProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Calculate discount percentage
  const calculateDiscount = () => {
    const originalPrice = parseFloat(product?.price[0]?.value);
    const offerPrice = parseFloat(product?.price[1]?.value);
    const discount = ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product?.uniqueID}`)}
      className="relative h-[25rem] cursor-pointer flex flex-col border rounded-lg shadow-lg overflow-hidden w-45  p-4 transition-transform transform hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="relative ">
        {product ? (
          <img
            src={product?.images[0]?.thumbnail || product?.thumbnail}
            alt={product?.name}
            className="w-full h-50 object-contain rounded-t-lg transition-opacity hover:opacity-80"
            onMouseOver={(e) =>
              (e.currentTarget.src =
                product?.images[0]?.fullImageRaw || product?.fullImage)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src = product?.images[0]?.thumbnail || product?.thumbnail)
            }
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={200} />
        )}
        {product && calculateDiscount() > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            {calculateDiscount()}% OFF
          </span>
        )}
      </div>
      <div className="flex flex-col justify-between flex-grow mt-4">
        {product ? (
          <>
            <h3 className="text-lg text-center font-semibold text-gray-900 ">
              {product?.name}
            </h3>
            <div className="flex justify-around items-center mt-2">
              {/* <span className="text-gray-600 text-sm">
                <del>${product?.price[0]?.value}</del>
              </span> */}
              <span className="text-purple-600 font-bold text-sm">
                $ {product?.price[1]?.value}
              </span>
            </div>
            {/* <div className="mt-2 text-sm text-gray-700">
              <p className="truncate">{product?.shortDescription}</p>
            </div> */}
          </>
        ) : (
          <>
            <Skeleton variant="rectangular" width="100%" height={200} />
          <Box sx={{ pt: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeProductCard;
