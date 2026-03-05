interface ProductImageProps {
    src: string;
    alt: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={src}
                alt={alt}
                className="w-full h-96 object-cover"
            />
        </div>
    );
}
