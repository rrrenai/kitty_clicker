import React, { useState, useCallback, useEffect } from "react";
import './App.css';

function Kitty({ handleClick, popClass, overlayPopClass, currentImage, currentOverlayImage }) {
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

function ItemButton({ cost, onClick, isAffordable }) {
  return (
    <>
      <button
        className={`item-button ${isAffordable ? "" : "disabled"}`}
        onClick={isAffordable ? onClick : null}
        disabled={!isAffordable}
      >
        {cost} click points
      </button>
    </>
  );
}

function ShopButton({ handleOpenShop, handleCloseShop, showShopClass, clickBalance, purchasedUpgrades, handlePurchase }) {
  const upgrades = [
    { name: "2x Click Multiplier!", price: 1 },
    { name: "Include keyboard clicks!", price: 2 },
    { name: "Christmas update :)", price: 3 },
  ];

  return (
    <>
      <button className="shop-button" onClick={handleOpenShop}>SHOP</button>
      
      {showShopClass && ( // Conditionally render the div
        <div className="shop-content">
          {showShopClass && (
            <button className="shop-close-button" onClick={handleCloseShop}>
              ✖
            </button>
          )}
          <h1>You have {clickBalance} click points!</h1>
          
          {upgrades.map((upgrade, index) => (
            <div key={index}>
              <p>{upgrade.name} - </p>
              <ItemButton
                cost={upgrade.price}
                onClick={() => handlePurchase(upgrade.price, upgrade.name)}
                isAffordable={!purchasedUpgrades.includes(upgrade.name) && clickBalance >= upgrade.price}
              />
            </div>
          ))}

          <h2>Purchased Upgrades:</h2>
          {purchasedUpgrades.length > 0 ? (
            <ul className="purchased-upgrades">
              {purchasedUpgrades.map((upgrade, index) => (
                <li key={index}>{upgrade}</li>
              ))}
            </ul>
          ) : (
            <p>No upgrades purchased yet.</p>
          )}

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
  const [purchasedUpgrades, setPurchasedUpgrades] = useState([]);
  const [clickMultiplier, setClickMultiplier] = useState(1); // Default to 1x multiplier

  // Load the overlay change sound when component mounts
  useEffect(() => {
    const overlayChangeSound = new Audio('kitties/meow.mp3');
    setOverlaySound(overlayChangeSound);
  }, []);

  const handleClick = useCallback(() => {
    setClickCounter((prev) => prev + 1 * clickMultiplier); 

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
    setTimeout(() => setPopClass(false), 300); 
  }, [clickCounter, catImages.length, overlayImages.length, overlaySound, clickMultiplier]);  // Make sure overlaySound is included in the dependencies


  const handleOpenShop = useCallback(() => {
    setShowShopClass(true); // Open the shop
  }, []);

  const handleCloseShop = useCallback(() => {
    setShowShopClass(false); // Close the shop
  }, []);

  

  const handleKeyboardClick = useCallback((event) => {
    if (purchasedUpgrades.includes("Include keyboard clicks!")) {
      const clickMultiplier = purchasedUpgrades.includes("2x Click Multiplier!") ? 2 : 1;
      setClickCounter((prev) => prev + clickMultiplier); 

      setPopClass(true);
      setTimeout(() => setPopClass(false), 300);
      
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % catImages.length);
      setCurrentOverlayIndex((prevIndex) => (prevIndex + 1) % overlayImages.length);

      if (overlaySound) {
        overlaySound.play();
      }
    }
  }, [purchasedUpgrades, overlaySound, catImages.length, overlayImages.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardClick);
    return () => {
      document.removeEventListener('keydown', handleKeyboardClick);
    };
  }, [handleKeyboardClick]);

  const handlePurchase = useCallback((cost, itemName) => {
    if (clickCounter >= cost) {
      setClickCounter((prev) => prev - cost);
      setPurchasedUpgrades((prev) => [...prev, itemName]);

      if (itemName === "2x Click Multiplier!") {
        setClickMultiplier(2); // Apply 2x multiplier
      } 
      if (itemName === "Include keyboard clicks!") {
        document.addEventListener('keydown', handleKeyboardClick);
      }
      if (itemName === "Christmas update :)") {
        var x = new Audio('./kitties/song.mp3');
        x.play();
      }
    } else {
      return;
    }
  }, [clickCounter, handleKeyboardClick]); 

  return (
    <div className="center">
      <ShopButton
        className="shopButton"
        handleOpenShop={handleOpenShop}
        handleCloseShop={handleCloseShop}
        showShopClass={showShopClass} 
        clickBalance={clickCounter}
        handlePurchase={handlePurchase}
        purchasedUpgrades={purchasedUpgrades}
      />

      <h1>Currently at {clickCounter} {clickCounter === 1 ? 'click' : 'clicks'}...</h1>
      <div className="cat-house">
        <Kitty 
          className="cat-button" 
          handleClick={handleClick} 
          popClass={popClass} 
          overlayPopClass={overlayPopClass}
          currentImage={catImages[currentImageIndex]}
          currentOverlayImage={overlayImages[currentOverlayIndex]}
        />
      </div>

      <footer className="footer">
        <p>Made with love! ~ <a href="https://github.com/rrrenai" rel="noreferrer" target="_blank">@rrrenai</a></p>
      </footer>

    </div>
  );
}