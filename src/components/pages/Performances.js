import React from 'react';
import './Performances.css';
import '../Button.css';
import Navbar from '../Navbar'; 

function Performances() {

  return (
    <>    
            <Navbar />      

            <div className="header1"><h1>Latest Events</h1></div>
            <div className="container">
                <div className="container2">
                    <iframe src="https://www.youtube.com/embed/-4MH-Wn7JRc" title="YouTube video player" frameborder="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div className="container2">
                <iframe  src="https://www.youtube.com/embed/38EsZnG_-v8" title="YouTube video player" frameborder="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div className="container2">
                <iframe src="https://www.youtube.com/embed/N5t2NqCZ8qQ" title="YouTube video player" frameborder="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div className="container2">
                <iframe src="https://www.youtube.com/embed/UfLLeH9BPiM" title="YouTube video player" frameborder="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div className="container2">
                <iframe src="https://www.youtube.com/embed/o3j-u3YY3IA" title="YouTube video player" frameborder="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div className="container2">
                <iframe src="https://www.youtube.com/embed/0hnzYU5ZpXI" title="YouTube video player" frameborder="1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
            
    </>
  );
}

export default Performances;