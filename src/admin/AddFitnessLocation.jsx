import React, { useState } from "react";
import SideBar from "./components/SideBar";
import { firestore } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function AddFitnessLocation() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new document in the 'fitnessLocations' collection
    const fitnessLocation = {
      name,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      await addDoc(collection(firestore, "fitnessLocations"), fitnessLocation);

      // Clear the form fields after successfully adding the location
      setName("");
      setAddress("");
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
