import React, { useState, useCallback, useEffect } from "react";
import './App.css';

function MyButton({ handleClick, popClass, overlayPopClass, currentImage, currentOverlayImage }) {
  return (
    <div className="image-stack">
      <img 
        className={`kitty-image ${popClass ? 'pop' : ''}`} 
        src={currentImage} 
        alt="cat" 
        onClick={handleClick}
      />
      <img
        src={currentOverlayImage}  // Use the current overlay image here
        alt="Overlay"
        className={`overlay-image ${overlayPopClass ? 'pop' : ''}`} // Apply pop effect to overlay
      />
    </div>
  );
}

function ShopButton({ handleClickShop, showShopClass }) {
  return (
    <>
      <button className="shop-button" onClick={handleClickShop}>SHOP</button>

      {showShopClass && ( // Conditionally render the div
        <div className="shop-content">
          <p>What is this?</p>
        </div>
      )}

    </>
  );
}

export default function App() {
  const catImages = [
    `./kitties/kitty1.png`,
    `./kitties/kitty2.png`,
    `./kitties/kitty3.png`
  ];
  
  const overlayImages = [
    `./kitties/color-yellow.png`,
    `./kitties/color-green.png`,
    `./kitties/color-pink.png`
  ];
  
  
  const [clickCounter, setClickCounter] = useState(0);
  const [popClass, setPopClass] = useState(false);
  const [overlayPopClass, setOverlayPopClass] = useState(false); // State for overlay pop
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentOverlayIndex, setCurrentOverlayIndex] = useState(0); // Track overlay image index
  const [overlaySound, setOverlaySound] = useState(null);  // Declare overlaySound state
  const [showShopClass, setShowShopClass] = useState(false);


  // Load the overlay change sound when component mounts
  useEffect(() => {
    const overlayChangeSound = new Audio('kitties/meow.mp3');
    setOverlaySound(overlayChangeSound);
  }, []);

  const handleClick = useCallback(() => {
    setClickCounter((prev) => prev + 1);

    // Change to the next cat image in the array
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % catImages.length);

    // Change to the next overlay image in the array every 5 clicks
    if ((clickCounter + 1) % 5 === 0) {
      // Play the overlay sound when the overlay changes
      if (overlaySound) {
        overlaySound.play();
      }

      // Trigger the overlay pop animation
      setOverlayPopClass(true);

      // Reset the overlay pop effect after 500ms (duration of the pop animation)
      setTimeout(() => setOverlayPopClass(false), 300); 

      setCurrentOverlayIndex((prevIndex) => (prevIndex + 1) % overlayImages.length);
    }

    // Set popClass to true to trigger the pop animation for the cat image
    setPopClass(true);

    // Remove popClass after 300ms (duration of the pop animation)
    setTimeout(() => setPopClass(false), 300); 
  }, [clickCounter, catImages.length, overlayImages.length, overlaySound]);  // Make sure overlaySound is included in the dependencies


  const handleClickShop = useCallback(() => {
    setShowShopClass((prev) => !prev); // Toggles between true and false
  }, []);

  return (
    <div className="center">

      <ShopButton handleClickShop={handleClickShop} showShopClass={showShopClass} />

      <h1>Currently at {clickCounter} {clickCounter === 1 ? 'click' : 'clicks'}...</h1>
      <div className="cat-house">
        <MyButton 
          className="cat-button" 
          handleClick={handleClick} 
          popClass={popClass} 
          overlayPopClass={overlayPopClass}  // Pass overlayPopClass to MyButton
          currentImage={catImages[currentImageIndex]}  // Pass the current cat image to MyButton
          currentOverlayImage={overlayImages[currentOverlayIndex]}  // Pass the current overlay image to MyButton
        />
      </div>

      <footer className="footer">
        <p>Made with love! ~ <a href="https://github.com/rrrenai" rel="noreferrer" target="_blank">@rrrenai</a></p>
      </footer>

    </div>
  );
}