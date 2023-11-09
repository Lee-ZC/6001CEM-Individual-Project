import React, { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebase";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
//import "./css/ManageLocations.css"; // Import the CSS file

function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsCollection = collection(firestore, "fitnessLocations");
      const locationsData = await getDocs(locationsCollection);

      const locations = locationsData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLocations(locations);
      setLoading(false);
    };

    fetchLocations();
  }, []);

  const handleUpdateLocation = async (locationId, location) => {
    const { value: formValues } = await Swal.fire({
      title: "Update Location",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Location Name" value="${location.name}">
        <input id="swal-input2" class="swal2-input" placeholder="Location Address" value="${location.address}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
        ];
      },
    });

    if (formValues) {
      const [newLocationName, newLocationAddress] = formValues;

      const updatedLocation = {
        ...location,
        name: newLocationName,
        address: newLocationAddress,
      };

      try {
        const locationDocRef = doc(firestore, `fitnessLocations/${locationId}`);
        await updateDoc(locationDocRef, updatedLocation);

        const updatedLocations = locations.map((l) => {
          if (l.id === locationId) {
            return updatedLocation;
          }
          return l;
        });

        setLocations(updatedLocations);
      } catch (error) {
        console.error(error);
        const errorMessage = error.message.replace("Firebase: ", "");
        Swal.fire("Error", errorMessage, "error");
      }
    }
  };

  const handleDeleteLocation = async (locationId) => {
    const result = await Swal.fire({
      title: "Delete Location",
      text: "Are you sure you want to delete this location? This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const locationDocRef = doc(firestore, `fitnessLocations/${locationId}`);
        await deleteDoc(locationDocRef);

        const updatedLocations = locations.filter(
          (location) => location.id !== locationId
        );

        setLocations(updatedLocations);
      } catch (error) {
        console.error(error);
        const errorMessage = error.message.replace("Firebase: ", "");
        Swal.fire("Error", errorMessage, "error");
      }
    }
  };

  return (
    <div>
      <SideBar>
        <div className="container location-container">
          <input
            type="text"
            placeholder="Search Locations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <br />
          <br />
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <table className="table location-table">
              <thead>
                <tr>
                  <th>Location Name</th>
                  <th>Location Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations
                  .filter((location) =>
                    location.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((location) => (
                    <tr key={location.id}>
                      <td>{location.name}</td>
                      <td>{location.address}</td>
                      <td className="button-container">
                        <button
                          onClick={() =>
                            handleUpdateLocation(location.id, location)
                          }
                          className="btn btn-primary"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(location.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </SideBar>
    </div>
  );
}

export default ManageLocations;
