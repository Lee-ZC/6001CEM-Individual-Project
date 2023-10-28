import React, { useState } from "react";
import SideBar from "./components/SideBar";
import { firestore } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

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
        <h2>Add Fitness Location</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Category:</label>
            <select
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
          <div>
            <label>Cost:</label>
            <input
              type="text"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Latitude:</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Longitude:</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit">Add Location</button>
          </div>
        </form>
      </SideBar>
    </div>
  );
}

export default AddFitnessLocation;
