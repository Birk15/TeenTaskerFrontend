import React, { useState } from "react";
import "./CreateOrder.css";
import axios from "axios";

const CreateOrder = () => {
  const [preview, setPreview] = useState(null); // Vorschau
  const [file, setFile] = useState(null); // Bilddatei

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Bildvorschau
      };
      reader.readAsDataURL(selectedFile); // Liest als Base64-String
      setFile(selectedFile); // Speichert Datei
    }
  };

  const addOrder = async (event) => {
    event.preventDefault();

    // FormData erstellen
    const formData = new FormData();
    formData.append("image", file); // Bilddatei anhängen

    // Benutzereingaben anhängen
    const inputs = ["name", "email", "title", "description", "price"];
    inputs.forEach((input) => {
      const value = document.getElementById(input)?.value || "";
      formData.append(input, value);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/add_order",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Serverantwort:", response.data);
      alert("Bild erfolgreich hochgeladen!");
    } catch (error) {
      if (error.response) {
        console.error("Fehler vom Server:", error.response.data);
        alert(`Fehler: ${error.response.data.message}`);
      } else {
        console.error("Netzwerkfehler:", error.message);
        alert("Netzwerkfehler! Bitte versuche es erneut.");
      }
    }
  };

  return (
    <div className="create-order">
      <h1>Create your first Order</h1>
      <form onSubmit={addOrder} className="create-items">
        <div className="create-item">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div className="create-item">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className="create-item">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </div>
        <div className="create-item">
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description" />
        </div>
        <div className="create-item">
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" />
        </div>
        <div className="upload-image">
          <label htmlFor="image-upload" className="upload-label">
            Upload an Image:
          </label>
          <input
            type="file"
            id="image-upload"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {preview && (
            <div id="preview-container">
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>
        <button className="save">Save</button>
      </form>
    </div>
  );
};

export default CreateOrder;
