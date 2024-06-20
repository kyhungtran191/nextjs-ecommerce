import React from "react";
import { Sofa, TreePine, Truck } from "lucide-react";
export default function Services() {
  const services = [
    {
      title: "Fast & affordable shipping",
      description:
        "We’re able to keep inventory on hand thanks to our modular design, which means your order gets to your door way faster.",
      icon: Truck,
    },
    {
      title: "Modular, easy-to-move design",
      description:
        "Our innovative modular design is driven by the belief that furniture should fit this home, and the next one.",
      icon: Sofa,
    },
    {
      title: "Durable, premium materials",
      description:
        "We use materials like sustainably-forested wood, strengthened steel hardware, and top-grain Italian leather.",
      icon: TreePine,
    },
  ];
  return (
    <section className="section bg-[#f7eee3] py-5 sm:py-14">
      <div className="container">
        <h2 className="section-heading">
          We’re solving the biggest problems in furniture
        </h2>
        <div className="grid medium:grid-cols-3 gap-5 medium:gap-10">
          {services.map((item) => (
            <div className="flex my-4 gap-5 items-center" key={item.title}>
              <item.icon className="w-14 h-14 sm:w-20 sm:h-20 object-cover"></item.icon>
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
