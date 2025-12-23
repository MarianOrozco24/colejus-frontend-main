import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/courtcarousel.css";

const CourtCarousel = ({ court }) => {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={30}
        slidesPerView={1}
        className="relative"
      >
        {chunkArray(court, 8).map((chunk, index) => (
          <SwiperSlide key={index}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-20 px-8">
              {chunk.map((member, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center space-y-2 text-center text-white"
                >
                  <h4 className="text-base 2xl:text-lg font-semibold">
                    {member.nombre}
                  </h4>
                  <p className="text-xs 2xl:text-sm">
                    {member.cargo} | Tel. {member.telefono}
                  </p>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Utility to chunk the array into groups of 8 (4 columns x 2 rows)
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export default CourtCarousel;
