import React from "react";
import style from "./Card.module.css";

function Card({ image, para }) {
  return (
    <div className={style.card}>
      <div className="group relative w-full h-full cursor-pointer overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/30">
        <div className="w-full h-full">
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:rotate-2 group-hover:scale-125"
            src={image}
            alt="Card Image"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-4">
          <p className="space-grotesk-uniquifier text-base md:text-lg text-white">{para}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
