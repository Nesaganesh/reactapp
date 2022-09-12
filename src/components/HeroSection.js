import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      <video src='https://s3.us-east-1.amazonaws.com/flytoez.content/FlytoezPromo1.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMiJHMEUCIDiJIhC7jHTTjZPQoma7%2FallZKJ7vrZImHQIkcZq5z%2FbAiEAnZ6lKqeTReZl0iAJflakYnOyF2pSQyFH73h8bqAl9wkq7QIIkf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARADGgw0MzcwNjUyOTU1MzQiDHTRC4cAjRfor1DqxyrBAmubXMyaISWvMtDNIZhv0WMNb3smQWRu61q3gijA5gfge2EpR%2FVAXcBzaERm62T2t71DVOmnIWnSqcl%2F46BjE10L3XcNMV7UZMDmNUnLI%2BPj5RzY%2BnhMy8K1Fqf%2BsMLL5YiW1oFdSWRrYMOYtE8432SDpftriFHW%2Bev3DsNLrVqrXpdQETjCcDVk%2BfoMHttwhQw6z9LgogY%2F3qQ6CMC0m%2FTJLNpN5D4HdQ%2BgmRZb2h0WBCzFoDGimdgimtJQux1U5TVVcjQqXj7d9TyUNHiA4cCw38sj0MYBw1ca5cnxNqhWke5nZxl01l34ixg5vZgtmgkD4uR3n%2FwlOvhua2aBsDfCpnaBSYAPaWAHGLl1nEN9h0Pxh7i6kbmvU2nYEWc3unFj2xum5PtYzar4fqeBK62Uq%2Fw6%2FhZfVmpZPc1N0HYJKzCcmv2YBjqzAj4mzDwyTbhyaUUHegURbLKvyMVah9ocIgW2kAPxHcWwTywDP7FrophLBsYaPSZ%2BmkA33eBq%2F5%2BdTo3kzKaoiapSnwh%2Bxn0%2F6h6A1dnAfNsgOjBgv8uxXnd5unv9DFq4D6XoalZxCf%2BHaX5XpZmykPmogJEqkCkjNw5gg8t4nw48aa%2F%2BB3LBr2RFq3PBnMPPVyN3KVUY2XaARx331I4mBz2ckLOZGAJBEoX7lzBRSpF7ASGUOOGJZZZtGPI5j7T1dSp1dZ%2FCzq%2BIsNC%2BnqGmWXPKzoEbCd1vnajg9mFGZMV0ieWEjoOZrbQzszvTmpyEtQ52yHvY9fDyLve6elTA7t0UQQ03BqXaZ7ynA9BhhUjW0eZ1PMwjEJGWMDilT2rkuKf632NESbUXkq08BUCHC9M%2Brb8%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20220912T161433Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAWLQY7E2XASWKLNWW%2F20220912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=cc412374d8b2b314852f10c7287d8e7f084bde4bbd96a20e87d10abddd655e2d' autoPlay loop muted />
      <h1>Bollyhood in Ipswich</h1>
      <p>What are you waiting for?</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          Sign up
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          About FDC <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
