"use client";

import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function PropertyImages({ images }) {
    return (
        <PhotoProvider loop>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, i) => (
                    <PhotoView key={i} src={img}>
                        <div className="relative w-full h-[250px] cursor-pointer">
                            <Image
                                src={img}
                                alt=""
                                width={400}
                                height={300}
                                className="cursor-pointer rounded"
                            />
                        </div>
                    </PhotoView>
                ))}
            </div>
        </PhotoProvider>
    );
}


// 'use client'
// import Image from "next/image";
// import { PhotoProvider, PhotoView } from 'react-photo-view';
// import 'react-photo-view/dist/react-photo-view.css'; // İstersen light box efekti için

// const PropertyImages = ({ images }) => {
//     return (
//         <section className="bg-blue-50 p-4">
//             <div className="container mx-auto">
//                 <h3 className="text-2xl font-bold mb-4 text-center">Gallery</h3>

//                 {images.length === 1 ? (
//                     <div className="relative h-[400px] w-full max-w-4xl mx-auto">
//                         <Image
//                             src={images[0]}
//                             alt=""
//                             fill
//                             className="object-cover rounded-xl shadow-lg"
//                             priority
//                             sizes="100vw"
//                         />
//                     </div>
//                 ) : (
//                     // GRID YAPISI DÜZELTİLDİ: Mobilde 1, Tablette 2, Masaüstünde 3 sütun
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                         {images.map((image, index) => (
//                             <div
//                                 key={index}
//                                 // Aspect Ratio (En boy oranı) ile resimleri kare/dikdörtgen kutulara zorla
//                                 className="relative aspect-[4/3] w-full group cursor-pointer"
//                             >
//                                 <Image
//                                     src={image}
//                                     alt=""
//                                     fill
//                                     className="object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow group-hover:opacity-90"
//                                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default PropertyImages;

// 'use client'
// import Image from "next/image";
// import { Gallery, Item } from "react-photoswipe-gallery";
// const PropertyImages = ({ images }) => {
//     return (
//         <Gallery>
//             <section className="bg-blue-50 p-4">
//                 <div className="container mx-auto">
//                     {images.length === 1 ? (
//                         <Item
//                             original={images[0]}
//                             thumbnail={images[0]}
//                             width="1000"
//                             height="600"
//                         >
//                             {({ ref, open }) => (
//                                 <Image
//                                     src={images[0]}
//                                     ref={ref}
//                                     onClick={open}
//                                     alt=''
//                                     className="object-cover h-[400px] mx-auto rounded-xl cursor-pointer"
//                                     width={800}
//                                     height={400}
//                                     priority={true}
//                                 />
//                             )}
//                         </Item>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {images.map((image, index) => (
//                                 <div key={index} className={`${images.length === 3 && index === 2 ? 'col-span-2' : 'col-span-1'}`}>
//                                     <Item
//                                         original={image}
//                                         thumbnail={image}
//                                         width="1000"
//                                         height="600"
//                                     >
//                                         {({ ref, open }) => (
//                                             <Image
//                                                 src={image}
//                                                 ref={ref}
//                                                 onClick={open}
//                                                 alt={`Property Image ${index + 1}`}
//                                                 className="object-cover rounded-xl cursor-pointer"
//                                                 width={1800}
//                                                 height={400}
//                                                 priority={index < 3} // Prioritize loading for the first 3 images
//                                             />
//                                         )}
//                                     </Item>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </section>
//         </Gallery>
//     );
// }

// export default PropertyImages;
