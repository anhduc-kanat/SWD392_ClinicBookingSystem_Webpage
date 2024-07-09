import React from 'react';
import './Feedback.css'; // Import the CSS file for custom styles

const Feedback = () => {
  return (
    <div className="feedback-container pb-32 pt-16">
      <div className="flex p-6 flex-col">
        <div className="w-full md:w-1/2 flex flex-col items-start mb-32">
          <span className="tracking-wide text-sm px-6 py-3 font-bold rounded-3xl mb-6 bg-[#e8e9ee] text-[#4457ff]">
            Feedback:
          </span>
          <h1 className="text-[40px] text-[#0b0a33] font-bold">
            Feedback from customers who came here this month.
          </h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8 grid-cols-1 relative reveal-onshow">
          <div className="p-10 shadow-md rounded-3xl flex flex-col">
            <div className="w-full flex gap-3 mb-4 items-center justify-start">
              <img
                src='/assets/avatar.png'
                alt="avatar"
                className="w-1/5 object-cover rounded-full"
              />
              <div className="flex flex-col gap-0.5">
                <h1 className="text-[22px] font-semibold text-[#0b0a33]">
                  Anh Trường
                </h1>
                <h1 className="text-[20px] text-[#4457ff]">
                  Check-ups and cleanings.
                </h1>
              </div>
            </div>
            <p className="text-[18px] text-[#7a7d9c] leading-[30px] font-medium tracking-wider">
              "Dr. Duc was amazing! He made me feel comfortable throughout the entire appointment and took the time to explain everything clearly. Highly recommend his services."
            </p>
          </div>
          <div className="p-10 shadow-md rounded-3xl flex flex-col">
            <div className="w-full flex gap-3 mb-4 items-center justify-start">
              <img
               src='/assets/avatar2.png'
                alt="avatar"
                className="w-1/5 object-cover rounded-full"
              />
              <div className="flex flex-col gap-0.5">
                <h1 className="text-[22px] font-semibold text-[#0b0a33]">
                  Minh Quang
                </h1>
                <h1 className="text-[20px] text-[#4457ff]">
                  Cosmetic dentistry interventions. Gum disease treatment.
                </h1>
              </div>
            </div>
            <p className="text-[18px] text-[#7a7d9c] leading-[30px] font-medium tracking-wider">
              "My experience at Dr. Duc's clinic was excellent. The staff was friendly and professional, and Dr. Duc provided top-notch care. I'm very satisfied with the results and will definitely be returning for future dental needs."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
