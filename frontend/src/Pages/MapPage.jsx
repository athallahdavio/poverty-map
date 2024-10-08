import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import BatasKabupatenKota from "../assets/kota-kabupaten.json";
import BatasProvinsi from "../assets/provinsi.json";
import MapComponent from "../Components/MapComponent";
import Sidebar, { SidebarItem } from "../Components/SidebarComponent";
import { House, Map, BarChart3, Database } from "lucide-react";
import { Helmet } from "react-helmet";
import { ClipLoader } from "react-spinners";

const MapPage = () => {
  const [API_URL] = useState(import.meta.env.VITE_API_URL);
  const [povertyData, setPovertyData] = useState(null);
  const [upper, setUpper] = useState(0);
  const [lower, setLower] = useState(0);
  const [type, setType] = useState({
    value: "poverty_amount",
    label: "Jumlah Penduduk Miskin",
  });
  const [level, setLevel] = useState("province");
  const [year, setYear] = useState(2023);
  const [geojson, setGeojson] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Set loading state to true when fetching data
    if (level === "province") {
      setGeojson(BatasProvinsi);
    } else if (level === "regency") {
      setGeojson(BatasKabupatenKota);
    }
    axios
      .get(
        API_URL +
          `/api/poverties/option?year=${year}&level=${level}&type=${type.value}`
      )
      .then((response) => {
        const data = response.data;
        setPovertyData(data.data);
        setUpper(data.upper);
        setLower(data.lower);
        setIsLoading(false); // Set loading state to false when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching poverty data:", error);
        setIsLoading(false); // Set loading state to false even if there is an error
      });
  }, [API_URL, level, year, type]);

  const levelOptions = [
    { value: "province", label: "Provinsi" },
    { value: "regency", label: "Kabupaten/Kota" },
  ];

  const yearOptions = [
    { value: 2021, label: "2021" },
    { value: 2022, label: "2022" },
    { value: 2023, label: "2023" },
  ];

  const typeOptions = [
    { value: "poverty_amount", label: "Jumlah Penduduk Miskin" },
    { value: "poverty_percentage", label: "Persentase Kemiskinan" },
    { value: "unemployed_percentage", label: "Persentase Tidak Bekerja" },
    {
      value: "uneducated_percentage",
      label: "Persentase Tidak Menyelesaikan Pendidikan",
    },
  ];

  const handleLevelChange = (selectedOption) => {
    setLevel(selectedOption.value);
  };

  const handleYearChange = (selectedOption) => {
    setYear(selectedOption.value);
  };

  const handleTypeChange = (selectedOption) => {
    setType(selectedOption);
  };

  return (
    <div className="flex h-screen">
      <Helmet>
        <title>SIG Pemetaan Kemiskinan | Peta</title>
      </Helmet>
      <Sidebar>
        <SidebarItem text={"Beranda"} icon={<House />} to={"/"} />
        <SidebarItem text={"Peta"} icon={<Map />} to={"/map"} active={true} />
        <SidebarItem text={"Grafik"} icon={<BarChart3 />} to={"/chart"} />
        <SidebarItem text={"Data"} icon={<Database />} to={"/data"} />
      </Sidebar>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
        </div>
      ) : (
        <MapComponent
          key={`${level}-${year}`}
          geojson={geojson}
          data={povertyData}
          upper={upper}
          lower={lower}
          level={level}
          type={type.value}
        />
      )}

      <div className="absolute top-5 right-4 z-50 flex flex-row gap-4">
        <div className="flex flex-col bg-white p-4 rounded shadow-xl border-black border-1 w-68">
          <label className="font-medium">Pilih Jenis Data:</label>
          <Select
            options={typeOptions}
            value={typeOptions.find((option) => option.value === type.value)}
            onChange={handleTypeChange}
            className="mt-2"
          />
        </div>
        <div className="flex flex-col bg-white p-4 rounded shadow-xl border-black border-1 w-52">
          <label className="font-medium">Pilih Tingkat:</label>
          <Select
            options={levelOptions}
            value={levelOptions.find((option) => option.value === level)}
            onChange={handleLevelChange}
            className="mt-2"
          />
        </div>
        <div className="flex flex-col bg-white p-4 rounded shadow-xl border-black border-1 w-32">
          <label className="font-medium">Pilih Tahun:</label>
          <Select
            options={yearOptions}
            value={yearOptions.find((option) => option.value === year)}
            onChange={handleYearChange}
            className="mt-2"
          />
        </div>
      </div>

      <div className="absolute bottom-3 right-3 bg-white p-4 rounded shadow-lg z-50 flex flex-col gap-1">
        <div className="font-medium mb-1">
          Klasifikasi Berdasarkan{" "}
          {type === "poverty_amount" ? "Jumlah Penduduk Miskin" : type.label}
        </div>
        <div className="flex flex-row items-center">
          <div className="bg-red-500 p-2 mr-1 border-2 border-gray-600"></div>
          <div className="">
            :{" "}
            {type === "poverty_amount"
              ? `Jumlah Penduduk Miskin > ${upper.toFixed(0)}`
              : `${type.label} > ${upper.toFixed(2)}`}
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="bg-yellow-200 p-2 mr-1 border-2 border-gray-600"></div>
          <div className="">
            : {upper.toFixed(type === "poverty_amount" ? 0 : 2)} ≤{" "}
            {type === "poverty_amount" ? "Jumlah Penduduk Miskin" : type.label}{" "}
            ≥ {lower.toFixed(type === "poverty_amount" ? 0 : 2)}
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="bg-green-600 p-2 mr-1 border-2 border-gray-600"></div>
          <div className="">
            :{" "}
            {type === "poverty_amount"
              ? `Jumlah Penduduk Miskin < ${lower.toFixed(0)}`
              : `${type.label} < ${lower.toFixed(2)}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
