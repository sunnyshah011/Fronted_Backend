import { useContext, useState } from 'react';
import Title from './Title';
import { ShopContext } from '../Context/ShopContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const P_Category = () => {

  const { products } = useContext(ShopContext)
  const [p_image, setimage] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      setimage(products.slice(0, 4))
    }
  }, [products])  // <- Watch for products update


  return (
    <div className="w-full mt-4 mb-7 px-2">
      <Link to='/collection' >
        <Title Category="Category" More="View All" />
      </Link>

      {p_image.length >= 4 ? (
        <div className="mt-5 grid gap-3 px-1 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {p_image.map((item, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={item.image[0]}
                alt={item.name || "Product"}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 text-center bg-black bg-opacity-30 flex flex-col justify-center items-center opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                <p className="bg-black bg-opacity-60 text-white text-sm font-medium px-4 py-1 rounded-full mb-1">
                  Category
                </p>
                <p className="text-white font-semibold text-lg">
                  {item.name || "Product"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-6 text-gray-500">Loading...</p>
      )}
    </div>
  )

}

export default P_Category;
