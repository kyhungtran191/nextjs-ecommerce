import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
export default function Slider() {
  return (
    <section className="section md:p-0 h-[390px] lg:h-[770px] w-full relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-black/40"></div>
      <video
        src="https://media.graphassets.com/5YwFLBdsR1ep60BQuj1B"
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
      ></video>
      <div className="px-5 medium:px-20 flex flex-col justify-start w-full h-full">
        <div className="absolute top-1/2 -translate-y-1/2">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
            className="text-2xl text-white md:text-2xl lg:text-[44px] font-semibold mb-3"
            style={{ lineHeight: "3rem" }}
          >
            Meet our new flame: <br />
            The Ember Seating Collection
          </motion.h1>
          <motion.p
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.75 }}
            className="mb-4 font-normal text-white md:text-sm lg:text-base max-w-[467px]"
          >
            It time to put on your furniture
          </motion.p>
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeOut", duration: 1 }}
            className=""
          >
            <Button
              type="button"
              className=" uppercase w-[300px] bg-yellow-500 text-darkGrey hover:text-white hover:bg-black font-semibold"
            >
              Shop Ember
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
