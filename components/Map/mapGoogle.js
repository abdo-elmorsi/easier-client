import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import icon from "./constants";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useRouter } from "next/router";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const options = {
  zoomControl: true,
};

const Location = ({
  disabled,
  apiKey,
  location,
  setLocation,
  className, 
  selectedLocation
}) => {
  const boxClasses = classNames(
    "app-map relative overflow-hidden",
    className
  );
  const router = useRouter();
  const language = router.locale.toLowerCase();

  const [located, setLocated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // State to control animation
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  // to get the location name (address)
  const geocodeLocation = useCallback((lat, lng) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK" && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setLocation((prev) => {
            return {
              ...prev,
              address: address
            }
          });
        } else {
          console.log("No results found");
        }
      })
      .catch((error) => console.log("Error:", error));
  }, []);


  // to update the location point
  const handleMapClick = useCallback((e) => {
    if (disabled) {
      return;
    }
    const latLng = e.latLng;
    setIsAnimating(true); // Trigger animation
    setLocation((prev) => {
      return {
        ...prev,
        lat: latLng.lat(),
        lng: latLng.lng(),
      }
    });
    geocodeLocation(latLng.lat(), latLng.lng());
  }, [disabled]);


  // to update the map icon location
  useEffect(() => {
    if (mapRef.current && location?.lat) {
      mapRef.current.panTo({ lat: location?.lat, lng: location?.lng });
      // geocodeLocation(location.lat, location.lng);
    }
    if (location?.lat && !located) {
      setLocated(true);
    }
  }, [location?.lat, located]);



  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      setIsAnimating(false); // Disable animation after a short delay
    }, 500);

    return () => clearTimeout(animationTimeout);
  }, [isAnimating]);


  // to get the current location for first time
  useEffect(() => {
    if (!location?.lat && !located && !disabled) {
      // Check if a specific location is selected
      if (selectedLocation?.lat && selectedLocation?.lng) {
        setLocation((prev) => ({
          ...prev,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        }));
        setLocated(true);
        geocodeLocation(selectedLocation.lat, selectedLocation.lng);
      } else {
        // Retrieve current geolocation
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation((prev) => ({
              ...prev,
              lat: latitude,
              lng: longitude,
            }));
            setLocated(true);
            geocodeLocation(latitude, longitude);
          },
          (error) => {
            console.log("Error getting current position:", error);
          }
        );
      }
    }
  }, [location?.lat, located, disabled]);

  // to handle map icon position
  const mapCoordinates = useMemo(() => {
    return location?.lat ? { lat: location?.lat, lng: location?.lng + (language === "en" ? -10 : 10) } : { lat: 24.774265, lng: 46.738586 };
  }, [location?.lat, language]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }


  return (
    <>
      <div className={boxClasses}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          options={options}
          center={mapCoordinates}
          zoom={7}
          onClick={handleMapClick}
          onLoad={(mapInstance) => (mapRef.current = mapInstance)}
        >
          {location?.lat && (
            <Marker
              position={location}
              ref={markerRef}
              icon={icon}
              draggable
              onDragEnd={(e) => handleMapClick(e)}
              animation={
                isAnimating
                  ? window.google.maps.Animation.BOUNCE
                  : null
              }
            />
          )}
        </GoogleMap>
      </div>
    </>
  );
};

Location.propTypes = {
  disabled: PropTypes.bool,
  apiKey: PropTypes.string.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    address: PropTypes.string,
  }),
  setLocation: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Location;