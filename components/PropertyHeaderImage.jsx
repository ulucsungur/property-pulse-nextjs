import Image from "next/image";

const PropertyHeaderImage = ({ image }) => {
    return (
        <section>
            <div className="container-xl m-auto">
                <div className="grid grid-cols-1">
                    {/* Kapsayıcıya relative ve yükseklik veriyoruz */}
                    <div className="relative h-[400px] w-full">
                        <Image
                            src={image}
                            alt=""
                            fill // Resmi kapsayıcıya yayar
                            className="object-cover" // Oranı bozmadan kırpar
                            sizes="100vw"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PropertyHeaderImage;
