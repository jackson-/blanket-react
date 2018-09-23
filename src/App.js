import React, { Component } from "react";
import "./App.css";
import Slider from "react-slick";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";

const SortableItem = SortableElement(({ value }) => <li>{value}</li>);

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      names: []
    };
  }

  componentDidMount() {
    const images = JSON.parse(localStorage.getItem("images"));
    const names = JSON.parse(localStorage.getItem("names"));
    if (images && names) {
      this.setState({ images, names });
    }
  }

  dropHandler = ev => {
    ev.preventDefault();
    const { images, names } = this.state;
    let name = "";
    let reader = new FileReader();
    reader.onload = e => {
      images.push(e.target.result);
      names.push(name);
      localStorage.setItem("images", JSON.stringify(images));
      localStorage.setItem("names", JSON.stringify(names));
      this.setState({ images, names });
    };
    // Prevent default behavior (Prevent file from being opened)
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          const file = ev.dataTransfer.items[i].getAsFile();
          name = file.name;
          reader.readAsDataURL(file);
        }
      }
    }

    this.removeDragData(ev);
  };

  removeDragData = ev => {
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
      return (
        <div className="slider" key={i}>
          <img className="image" src={image} alt="carousel" />
        </div>
      );
    });
  };

  renderNames = () => {
    return this.state.names.map((name, i) => {
      return <p key={i}>{name}</p>;
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const names = arrayMove(this.state.names, oldIndex, newIndex)
    const images = arrayMove(this.state.images, oldIndex, newIndex)
    localStorage.setItem("images", JSON.stringify(images));
    localStorage.setItem("names", JSON.stringify(names));
    this.setState({
      names,
      images,
    });
  };

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
        <Slider {...settings}>{this.renderImages()}</Slider>
        <SortableList items={this.state.names} onSortEnd={this.onSortEnd} />
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
