import React from 'react';
import './Testimonials.css';

const testimonialsData = [
  {
    name: 'John Doe',
    text: 'Flytoez Dance Company has transformed my dancing skills. The instructors are amazing!',
    image: 'path/to/john-image.jpg'
  },
  {
    name: 'Jane Smith',
    text: 'I love the energy and passion at Flytoez Dance Company. Highly recommend!',
    image: 'path/to/jane-image.jpg'
  },
  {
    name: 'Sam Wilson',
    text: 'A fantastic place to learn and grow as a dancer. The community is very supportive.',
    image: 'path/to/sam-image.jpg'
  }
];

const Testimonials = () => {
  return (
    <div className='testimonials-container'>
      <h2>What Our Students Say</h2>
      <div className='testimonials'>
        {testimonialsData.map((testimonial, index) => (
          <div key={index} className='testimonial'>
            <img src={testimonial.image} alt={testimonial.name} className='testimonial-image' />
            <p className='testimonial-text'>"{testimonial.text}"</p>
            <p className='testimonial-name'>- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;