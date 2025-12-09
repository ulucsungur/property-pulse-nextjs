import Image from "next/image";

const PropertyImages = ({ images }) => {
    return (
        <section className="bg-blue-50 p-4">
            <div className="container mx-auto">
                {images.length === 1 ? (
                    <Image
                        src={images[0]}
                        alt=''
                        className="object-cover h-[400px] mx-auto rounded-xl"
                        width={800}
                        height={400}
                        priority={true}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                            <div key={index} className={`${images.length === 3 && index === 2 ? 'col-span-2' : 'col-span-1'}`}>
                                <Image
                                    src={image}
                                    alt={`Property Image ${index + 1}`}
                                    className="object-cover rounded-xl"
                                    width={1800}
                                    height={400}
                                    priority={index < 3} // Prioritize loading for the first 3 images
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>);
}

export default PropertyImages;
