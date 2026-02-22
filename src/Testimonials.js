import React from 'react';
import './Testimonials.css';

const testimonialsData = [
  {
    name: 'Aarav Mehta',
    text: 'Flytoez Dance Company helped me discover my love for Bollywood dance. Every class is full of energy and fun!',
  },
  {
    name: 'Priya Sharma',
    text: 'I joined Flytoez to stay active, but I found a family instead! The instructors are so patient and inspiring.',
  },
  {
    name: 'Rohan Patel',
    text: 'The choreography, music, and vibe are just amazing. I’ve grown so much as a dancer thanks to Flytoez!',
  },
  {
    name: 'Ananya Iyer',
    text: 'Flytoez brings Bollywood alive in Ipswich! Every class boosts my confidence and makes me smile.',
  }
];

const Testimonials = () => {
  return (
    <div className='testimonials-container'>
      <h2>What Our Students Say</h2>
      <div className='testimonials'>
        {testimonialsData.map((testimonial, index) => (
          <div key={index} className='testimonial'>
            <p className='testimonial-text'>"{testimonial.text}"</p>
            <p className='testimonial-name'>– {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
