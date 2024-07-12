import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ data, geojson, upper, lower, level }) => {

  const logMismatchedNames = (geojsonNames, dataNames) => {
    const missingInData = geojsonNames.filter(name => !dataNames.includes(name));
    const missingInGeojson = dataNames.filter(name => !geojsonNames.includes(name));

    if (missingInData.length > 0) {
      console.log("Names in GeoJSON but not in data:", missingInData);
    }
    if (missingInGeojson.length > 0) {
      console.log("Names in data but not in GeoJSON:", missingInGeojson);
    }
  };

  useEffect(() => {
    if (geojson && data) {
      const geojsonNames = geojson.features.map(feature => feature.properties.NAME_2 || feature.properties.NAME_1);
      const dataNames = data.map(d => d.regency_id?.name || d.province_id?.name);
      logMismatchedNames(geojsonNames, dataNames);
    }
  }, [geojson, data]);

  const onEachFeature = (feature, layer) => {
    let properties = feature.properties;
    let additionalInfo = '';

    if (level === "regency") {
      let regencyName = properties.NAME_2;
      let povertyInfo = data?.find(p => p.regency_id?.name === regencyName);

      if (povertyInfo) {
        additionalInfo = `
          <b>${regencyName}</b><br>
          Kemiskinan: ${povertyInfo.poverty_percentage}%<br>
          Tidak Bekerja: ${povertyInfo.unemployed_percentage}%<br>
          Tidak Menyelesaikan Pendidikan: ${povertyInfo.uneducated_percentage}%
        `;
      }

      layer.bindPopup(additionalInfo, {
        minWidth: 310
      });
    } else {
      let provinceName = properties.NAME_1;
      let povertyInfo = data?.find(p => p.province_id?.name === provinceName);

      if (povertyInfo) {
        additionalInfo = `
          <b>Provinsi ${provinceName}</b><br><br> 
          Persentase Kemiskinan: ${povertyInfo.poverty_percentage}%<br>
          Persentase Tidak Bekerja: ${povertyInfo.unemployed_percentage}%<br>
          Persentase Tidak Menyelesaikan Pendidikan: ${povertyInfo.uneducated_percentage}%
        `;
      }

      layer.bindPopup(additionalInfo, {
        minWidth: 310
      });
    }
  };

  const getColor = (povertyPercentage) => {
    if (povertyPercentage > upper) return "red";
    if (povertyPercentage < lower) return "green";
    return "yellow";
  };

  const style = (feature) => {
    if (level === "regency") {
      const regencyName = feature.properties.NAME_2;
      const povertyInfo = data?.find((p) => p.regency_id?.name === regencyName);
      const povertyPercentage = povertyInfo?.poverty_percentage;

      return {
        fillColor: getColor(povertyPercentage),
        weight: 1,
        opacity: 1,
        color: "grey",
        fillOpacity: 0.7,
      };
    } else {
      const provinceName = feature.properties.NAME_1;
      const povertyInfo = data?.find((p) => p.province_id?.name === provinceName);
      const povertyPercentage = povertyInfo?.poverty_percentage;

      return {
        fillColor: getColor(povertyPercentage),
        weight: 1,
        opacity: 1,
        color: "grey",
        fillOpacity: 0.7,
      };
    }
  };

  return (
    <div className="z-0 h-full w-full">
      <MapContainer
        center={[-2.5489, 118.0149]}
        zoom={5}
        zoomControl={true}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geojson && data && upper && lower && level && (
          <GeoJSON data={geojson} style={style} onEachFeature={onEachFeature} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
