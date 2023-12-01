import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "./constants";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import * as L from "leaflet"
// eslint-disable-next-line no-undef
const apiKey = process.env.MAP_API_KEY;

const Location = ({ location, setLocation, setAddress, className }) => {
  // const L = require("leaflet");

  const boxClasses = classNames(
    `app-map relative w-[1200px] h-[600px] overflow-hidden`,
    className
  );

  const [located, setLocated] = useState(false);
  const [searchControl, setSearchControl] = useState(null);
  const mapRef = useRef(null);

  const geocodeLocation = (lat, lng) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK" && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setAddress(address);
        } else {
          console.log("No results found");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const recenter = () => {
    if (located && mapRef.current) {
      mapRef.current.locate().on("locationfound", (e) => {
        mapRef.current.setView(L.latLng(e.latlng), 11);
      });
    }
  };

  const handleLocationFound = (e) => {
    const { lat, lng } = e.latlng;
    setLocation((prev) => ({
      ...prev,
      location: {
        coordinates: e.latlng,
        address: "homeLocation",
      },
    }));
    mapRef.current.panTo(e.latlng);
    geocodeLocation(lat, lng);
    setLocated(true);
  };

  function LocationMarker() {
    const map = useMapEvents({
      click: (e) => {
        try {
          setLocation((prev) => ({
            ...prev,
            location: {
              coordinates: e.latlng,
              address: "homeLocation",
            },
          }));
          map.panTo(e.latlng);
          geocodeLocation(e.latlng.lat, e.latlng.lng);
        } catch (error) {
          console.log(error);
        }
      },
    });

    useEffect(() => {
      if (!located && !location?.location?.coordinates) {
        map.locate().on("locationfound", handleLocationFound);
      } else if (location?.location?.coordinates) {
        map.panTo(location.location.coordinates);
        setLocated(true);
      }

      if (searchControl) {
        searchControl.addTo(map);
      }

      return () => {
        if (searchControl) {
          map.removeControl(searchControl);
        }
      };
    }, [map, located, location, setLocation, searchControl]);

    if (!location?.location?.coordinates) {
      return null;
    }

    const { lat, lng } = location.location.coordinates;

    return (
      <Marker
        key={`marker-${lat}-${lng}`}
        position={location.location.coordinates}
        icon={icon}
      >
        <Popup>
          You are here. <br />
          <b>Latitude:</b> {lat.toFixed(6)} <br />
          <b>Longitude:</b> {lng.toFixed(6)}
        </Popup>
      </Marker>
    );
  }

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      autoCompleteDelay: 200,
      showMarker: true,
      Marker: icon,
      searchLabel: "Search for an address",
      keepResult: true,
      maxMarkers: 1,
      style: "button",
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      autoSearch: true,
      search: (searchText) => {
        provider.search({ query: searchText }).then((results) => {
          if (results.length === 0) {
            console.log("No results found");
          } else {
            const { x, y } = results[0].properties;
            setLocation((prev) => ({
              ...prev,
              location: {
                coordinates: { lat: y, lng: x },
                address: results[0].label,
              },
            }));
            geocodeLocation(y, x);
          }
        });
      },
    });
    setSearchControl(searchControl);
  }, []);

  return (
    <div
      className={boxClasses}>
      <MapContainer
        ref={mapRef}
        center={[31.276701243852184, 43.94662768202458]}
        zoom={7}
        minZoom={2}
        maxZoom={18}
        scrollWheelZoom
        className="h-full w-full"
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)} // Set the map instance using the ref
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
      {/* <button className="re-center-btn" onClick={recenter}>
        Recenter
      </button> */}
    </div>
  );
}

Location.propTypes = {
  location: PropTypes.shape({
    location: PropTypes.shape({
      coordinates: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }),
      address: PropTypes.string,
    }),
  }),
  setLocation: PropTypes.func,
  setAddress: PropTypes.func,
  className: PropTypes.string,
};

export default Location