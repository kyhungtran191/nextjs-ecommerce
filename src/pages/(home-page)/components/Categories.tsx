import Image from "next/image";
import React from "react";
import Dining from "../../../../public/dining.jpg";
import Living from "../../../../public/living.jpg";
import Bedroom from "../../../../public/bedroom.jpg";
import Rug from "../../../../public/rug.jpg";
import Seating from "../../../../public/seating.jpg";
import Storage from "../../../../public/storage.jpg";
import Link from "next/link";

export default function Categories() {
  const categories = [
    {
      title: "Seating",
      link: "",
      image: Seating,
    },
    {
      title: "Dining",
      link: "",
      image: Dining,
    },
    {
      title: "Living",
      link: "",
      image: Living,
    },
    {
      title: "Bedroom",
      link: "",
      image: Bedroom,
    },
    {
      title: "Rug",
      link: "",
      image: Rug,
    },
    {
      title: "Storage",
      link: "",
      image: Storage,
    },
  ];

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-heading">Clever designs for every corner</h2>
        <div className="grid grid-cols-3 gap-5">
          {categories.map((item) => (
            <Link
              href=""
              className="relative h-[340px] w-full cursor-pointer group"
              key={item.title}
            >
              <Image
                src={item.image}
                alt=" "
                width={0}
                height={0}
                className="w-full h-full object-cover"
              ></Image>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-all duration-300 ease-in-out"></div>
              <div className="absolute text-4xl left-1/2 bottom-5 -translate-x-1/2 underline text-white">
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
