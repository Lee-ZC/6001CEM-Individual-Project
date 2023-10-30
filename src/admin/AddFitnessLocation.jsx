import React, { useState } from "react";
import SideBar from "./components/SideBar";
import { firestore } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./css/AddFitnessLocation.css"; // Import your custom CSS

function AddFitnessLocation() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [category, setCategory] = useState("Outdoor Activities"); // Default to "Outdoor Activities"
  const [cost, setCost] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new document in the 'fitnessLocations' collection
    const fitnessLocation = {
      name,
      address,
      category, // Add the selected category to the document
      cost, // Add the cost to the document
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      await addDoc(collection(firestore, "fitnessLocations"), fitnessLocation);

      // Clear the form fields after successfully adding the location
      setName("");
      setAddress("");
      setCategory("Outdoor Activities"); // Reset to the default category
      setCost("");
      setLatitude("");
      setLongitude("");

      alert("Fitness location added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <SideBar>
        <div className="fitness-location-form">
          <h2 className="page-title">Add Fitness Location</h2>
          <form className="add-location-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address:
              </label>
              <input
                type="text"
                id="address"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category:
              </label>
              <select
                id="category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Outdoor Activities">Outdoor Activities</option>
                <option value="Group Fitness Classes">
                  Group Fitness Classes
                </option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cost" className="form-label">
                Cost:
              </label>
              <input
                type="text"
                id="cost"
                className="form-input"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="latitude" className="form-label">
                Latitude:
              </label>
              <input
                type="number"
                id="latitude"
                className="form-input"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="longitude" className="form-label">
                Longitude:
              </label>
              <input
                type="number"
                id="longitude"
                className="form-input"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit" className="submit-button">
                Add Location
              </button>
            </div>
          </form>
        </div>
      </SideBar>
    </div>
  );
}

export default AddFitnessLocation;
