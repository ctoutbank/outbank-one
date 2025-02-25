"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageSquareTextIcon } from 'lucide-react';

interface Testimonial {
  id: number;
  title: string;
  content: string;
  customerName: string;
  customerProfile: string;
  customerImage: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    title: 'FANTASTIC SERVICE',
    content: 'Lorem ipsum dolor sit amet consectetur. Tempus purus placerat nibh suspendisse. Tellus arcu egestas vitae sapien tempus egestas. Suspendisse volutpat bibendum quam senectus.',
    customerName: 'Customer Name',
    customerProfile: '@customerprofile',
    customerImage: '/images/customers/customer1.jpg',
  },
  {
    id: 2,
    title: 'FAST RECEIPT',
    content: 'Lorem ipsum dolor sit amet consectetur. Tempus purus placerat nibh suspendisse. Tellus arcu egestas vitae sapien tempus egestas. Suspendisse volutpat bibendum quam senectus.',
    customerName: 'Customer Name',
    customerProfile: '@customerprofile',
    customerImage: '/images/customers/customer2.jpg',
  },
  {
    id: 3,
    title: 'SECURE PLATFORM',
    content: 'Lorem ipsum dolor sit amet consectetur. Tempus purus placerat nibh suspendisse. Tellus arcu egestas vitae sapien tempus egestas. Suspendisse volutpat bibendum quam senectus. At',
    customerName: 'Customer Name',
    customerProfile: '@customerprofile',
    customerImage: '/images/customers/customer3.jpg',
  },
  {
    id: 4,
    title: 'SECURE',
    content: 'Lorem ipsum dolor sit amet consectetur. Tempus purus placerat nibh suspendisse. Tellus arcu egestas vitae sapien tempus egestas. Suspendisse volutpat bibendum quam senectus.',
    customerName: 'Customer Name',
    customerProfile: '@customerprofile',
    customerImage: '/images/customers/customer4.jpg',
  },
];

const Depoiments: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleTestimonials = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % (testimonials.length - visibleTestimonials + 1)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="bg-black text-white py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="bg-gray-600/20 text-gray-300 px-4 py-2 border border-gray-600/40 text-sm rounded-2xl inline-block mb-6">DEPOIMENTS</div> 
        
        <h2 className="text-4xl md:text-5xl font-light max-w-7xl mb-14">What they say about us</h2>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleTestimonials)}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}  
                className="flex-shrink-0 w-full md:w-1/3 px-4"
              >
                <div className="bg-[#080808] p-8 h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs text-muted-foreground ">{testimonial.title}</h3>
                    <div className="border border-gray-700/20 p-1  rounded-sm bg-gradient-to-r from-[#080808] to-gray-600/20">
                    <MessageSquareTextIcon className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-8">{testimonial.content}</p>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                      <Image 
                        src={testimonial.customerImage} 
                        alt={testimonial.customerName}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.customerName}</h4>
                      <p className="text-sm text-gray-500">{testimonial.customerProfile}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          {Array.from({ length: testimonials.length - visibleTestimonials + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 mx-1 rounded-full ${
                currentIndex === index ? 'bg-white' : 'bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Depoiments;
