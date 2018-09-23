import React, { Component } from "react";
import "./App.css";
import Slider from "react-slick";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    };
  }

  dropHandler = ev => {
    ev.preventDefault();
    const {images} = this.state;
    let reader = new FileReader();
    reader.onload = e => {
      images.push(e.target.result)
      console.log("IMAGES", images)
      this.setState({ images });
    };
    // Prevent default behavior (Prevent file from being opened)
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          const file = ev.dataTransfer.items[i].getAsFile();
          reader.readAsDataURL(file);
        }
      }
    }

    this.removeDragData(ev);
  };

  removeDragData = ev => {
    console.log("Removing drag data");

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      ev.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
  };

  dragging = e => {
    e.preventDefault();
  };

  renderImages = () => {
    return this.state.images.map((image, i) => {
      console.log("IMAGE", image)
      return (
        <div  className="slider" key={i}>
          <img className="image" src={image} alt="carousel" />
        </div>
      )
    })
  }

  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <div className="App">
        <Slider {...settings}>
          {this.renderImages()}
        </Slider>
        <div
          id="drop_zone"
          onDragOver={this.dragging}
          onDrop={this.dropHandler}
        >
          <p>Drag one or more files to this Drop Zone ...</p>
        </div>
        <div>stuff</div>
      </div>
    );
  }
}

export default App;
