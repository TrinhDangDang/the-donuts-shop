import Image from "next/image";

interface MenuItemCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
}

export default function MenuItemCard({
  title,
  description,
  price,
  image,
}: MenuItemCardProps) {
  return (
    <div className="bg-white max-w-sm w-full rounded-lg overflow-hidden min-w-[250px]">
      <div className="relative w-full h-[200px]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4 font-[family-name:var(--font-open-sans)]">
        <h3 className="text-xl font-semibold text-amber-700">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="mt-2 text-md font-bold text-gray-800">{price}</p>
      </div>
    </div>
  );
}
