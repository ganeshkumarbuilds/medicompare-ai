import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
const hospitalIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/2967/2967350.png",

  iconSize: [40, 40],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/149/149071.png",

  iconSize: [35, 35],
});

const nearestIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3177/3177361.png",

  iconSize: [45, 45],
});

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}
function Routing({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1]),
      ],

      routeWhileDragging: false,

      show: false,

      addWaypoints: false,

      draggableWaypoints: false,
    }).addTo(map);

    return () => {
      map.removeControl(
        routingControl
      );
    };
  }, [map, from, to]);

  return null;
}
function HospitalMap() {
  const [hospitals, setHospitals] =
    useState([]);

  const [userLocation, setUserLocation] =
    useState(null);

  const [nearestHospital, setNearestHospital] =
    useState(null);
    const [selectedHospital,
setSelectedHospital] =
useState(null);

  useEffect(() => {
    fetchHospitals();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  useEffect(() => {
    if (
      userLocation &&
      hospitals.length > 0
    ) {
      const [lat, lng] =
        userLocation;

      let nearest = hospitals[0];

      let minDistance =
        calculateDistance(
          lat,
          lng,
          nearest.latitude,
          nearest.longitude
        );

      hospitals.forEach((hospital) => {
        const distance =
          calculateDistance(
            lat,
            lng,
            hospital.latitude,
            hospital.longitude
          );

        if (distance < minDistance) {
          minDistance = distance;

          nearest = {
            ...hospital,
            distance,
          };
        }
      });

      if (!nearest.distance) {
        nearest.distance = minDistance;
      }

      setNearestHospital(nearest);
    }
  }, [userLocation, hospitals]);

  const fetchHospitals =
    async () => {
      try {
        const { data } =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/hospitals`
          );

        setHospitals(data);
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="p-5">

      <h1 className="text-4xl font-bold mb-5">
        🗺️ Hospital Map
      </h1>

      {nearestHospital && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-5 mb-5">

          <h2 className="text-2xl font-bold text-green-700">
            🏆 Nearest Hospital
          </h2>

          <p className="mt-2 text-lg font-semibold">
            {nearestHospital.name}
          </p>

          <p>
            📍 {nearestHospital.address}
          </p>

          <p>
            ⭐ {nearestHospital.rating}
          </p>

          <p className="text-green-600 font-bold">
            📏{" "}
            {nearestHospital.distance?.toFixed(
              2
            )}{" "}
            km away
          </p>
        </div>
      )}

      <MapContainer
        center={
          userLocation || [
            17.385,
            78.4867,
          ]
        }
        zoom={12}
        style={{
          height: "600px",
          width: "100%",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
            <Marker
  position={userLocation}
  icon={userIcon}>

            <Popup>
              📍 Your Location
            </Popup>
          </Marker>
        )}

        {hospitals.map(
          (hospital) => (
            <Marker
  key={hospital._id}
  position={[
    hospital.latitude,
    hospital.longitude,
  ]}
  icon={
    nearestHospital &&
    hospital._id ===
      nearestHospital._id
      ? nearestIcon
      : hospitalIcon
  }
>
           
              <Popup>

                <h3 className="font-bold">
                  {hospital.name}
                </h3>

                <p>
                  {hospital.address}
                </p>

                <p>
                  ⭐ {hospital.rating}
                </p>

                <div className="flex gap-2 mt-2">

  <button
    onClick={() =>
      (window.location.href =
        `/hospitals/${hospital._id}`)
    }
    className="bg-blue-600 text-white px-3 py-2 cursor-pointer rounded"
  >
    View
  </button>

  <button
    onClick={() =>
      setSelectedHospital(
        hospital
      )
    }
    className="bg-green-600 text-white px-3 py-2 cursor-pointer rounded"
  >
    Route
  </button>

</div>

              </Popup>
            </Marker>
          )
        )}
        {userLocation &&
 selectedHospital && (
  <Routing
    from={userLocation}
    to={[
      selectedHospital.latitude,
      selectedHospital.longitude,
    ]}
  />
)}
      </MapContainer>

    </div>
  );
}

export default HospitalMap;