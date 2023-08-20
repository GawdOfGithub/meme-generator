import React, { useState, useEffect, useRef } from "react";
import html2canvas from 'html2canvas';
import './App.css';

export default function App() {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    randomImage: ""
  });

  const [allMemeImages, setAllMemeImages] = useState([]);

  useEffect(() => {
    fetchMemeImages();
  }, []);

  function fetchMemeImages() {
    const corsProxyUrl = "https://api.allorigins.win/get?url=";
    const apiUrl = "https://api.imgflip.com/get_memes";

    fetch(corsProxyUrl + encodeURIComponent(apiUrl))
      .then((res) => res.json())
      .then((data) => {
        const response = JSON.parse(data.contents);
        setAllMemeImages(response.data.memes);
      })
      .catch((error) => console.log(error));
  }

  function getImage(event) {
    event.preventDefault();
    if (allMemeImages.length === 0) {
      return; // Handle case when meme images are not fetched yet
    }
    const randomNo = Math.floor(Math.random() * allMemeImages.length);
    const url = allMemeImages[randomNo].url;
    setMeme(prevMeme => ({
      ...prevMeme,
      randomImage: url
    }));
  }

  const memeContainerRef = useRef(null);

  function exportMemeImage() {
    const memeContainer = memeContainerRef.current;

    html2canvas(memeContainer, { useCORS: true })
      .then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        link.download = "meme.png";
        link.click();
      })
      .catch(error => console.log(error));
  }

  return (
    <>
      <div id="head">
        <img src="Troll Face.png" alt="Generator" />
        <h3>GAWD MEME GENERATOR</h3>
      </div> 

      <form onSubmit={getImage}>
        <div id="fields">
          <input
            type="text"
            id="field1"
            value={meme.topText}
            onChange={event =>
              setMeme(prevMeme => ({
                ...prevMeme,
                topText: event.target.value
              }))
            }
          />
          <input
            type="text"
            id="field2"
            value={meme.bottomText}
            onChange={event =>
              setMeme(prevMeme => ({
                ...prevMeme,
                bottomText: event.target.value
              }))
            }
          />
        </div>

        <div id="button">
          <input
            type="submit"
            id="generateButton"
            value="Generate Meme"
          />
        </div>
      </form>

      <div id="image">
        <div id="meme-container" ref={memeContainerRef}>
          {meme.randomImage && (
            <img src={meme.randomImage} alt="Meme Image" width="100%" height="100%" />
          )}
          <div id="textOverlayTop" className="textOverlay">{meme.topText}</div>
          <div id="textOverlayBottom" className="textOverlay">{meme.bottomText}</div>
        </div>
        <button className="exportButton" onClick={exportMemeImage}>
          Export Meme
        </button>
      </div>
    </>
  );
}
