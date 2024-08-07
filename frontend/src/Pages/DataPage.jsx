import { useEffect, useState } from "react";
import Select from "react-select";
import Sidebar, { SidebarItem } from "../Components/SidebarComponent";
import { House, Map, BarChart3, Database } from "lucide-react";
import DataTableComponent from "../Components/DataTableComponent";
import axios from "axios";
import { Helmet } from "react-helmet";

const DataPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [columns, setColumns] = useState([]);
  const [povertyData, setPovertyData] = useState(null);
  const [year, setYear] = useState({ value: 2023, label: 2023 });
  const [yearOptions, setYearOptions] = useState(null);
  const [level, setLevel] = useState({ value: "province", label: "Provinsi" });
  const [filtering, setFiltering] = useState("");

  useEffect(() => {
    const fetchYearOptions = async () => {
      if (level.value == "province") {
        const response = await axios.get(
          `${API_URL}/api/poverties/province-year`
        );
        try {
          const yearOptionsFromApi = response.data.map((year) => ({
            value: year,
            label: year.toString(),
          }));
          setYearOptions(yearOptionsFromApi);
        } catch (error) {
          console.error("Error fetching year options:", error);
        }
      } else {
        const response = await axios.get(
          `${API_URL}/api/poverties/regency-year`
        );
        try {
          const yearOptionsFromApi = response.data.map((year) => ({
            value: year,
            label: year.toString(),
          }));
          setYearOptions(yearOptionsFromApi);
        } catch (error) {
          console.error("Error fetching year options:", error);
        }
      }
    };
    fetchYearOptions();
  }, [API_URL, level]);

  const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
  };

  useEffect(() => {
    const endpoint =
      level.value === "province"
        ? "/api/poverties/province/year"
        : "/api/poverties/regency/year";

    const commonColumns = [
      {
        header: "Persentase Kemiskinan",
        accessorKey: "poverty_percentage",
      },
      {
        header: "Persentase Tidak Bekerja",
        accessorKey: "unemployed_percentage",
      },
      {
        header: "Persentase Tidak Menyelesaikan Pendidikan",
        accessorKey: "uneducated_percentage",
      },
    ];

    if (level.value === "province") {
      setColumns([
        {
          header: "Provinsi",
          accessorKey: "province_id.name",
        },
        {
          header: "Jumlah Penduduk Miskin",
          accessorKey: "poverty_amount",
          cell: (info) => formatNumber(info.getValue()),
        },
        ...commonColumns,
      ]);
    } else {
      setColumns([
        {
          header: "Kabupaten/Kota",
          accessorKey: "regency_id.name",
        },
        {
          header: "Provinsi",
          accessorKey: "province_id.name",
        },
        {
          header: "Jumlah Penduduk Miskin",
          accessorKey: "poverty_amount",
          cell: (info) => formatNumber(info.getValue()),
        },
        ...commonColumns,
      ]);
    }

    if (year) {
      fetchPovertyData(year.value, endpoint);
    }
  }, [year, level]);

  const fetchPovertyData = (selectedYear, endpoint) => {
    fetch(API_URL + `${endpoint}?year=${selectedYear}`)
      .then((response) => response.json())
      .then((data) => setPovertyData(data))
      .catch((error) => console.error("Error fetching poverty data:", error));
  };

  const handleYearChange = (selectedYear) => {
    setYear(selectedYear);
  };

  const levelOptions = [
    { value: "province", label: "Provinsi" },
    { value: "regency", label: "Kabupaten/Kota" },
  ];

  return (
    <div className="flex h-full">
      <Helmet>
        <title>SIG Pemetaan Kemiskinan | Data</title>
      </Helmet>
      <Sidebar>
        <SidebarItem text={"Beranda"} icon={<House />} to={"/"} />
        <SidebarItem text={"Peta"} icon={<Map />} to={"/map"} />
        <SidebarItem text={"Grafik"} icon={<BarChart3 />} to={"/chart"} />
        <SidebarItem
          text={"Data"}
          icon={<Database />}
          to={"/data"}
          active={true}
        />
      </Sidebar>
      <div className="h-full w-full">
        <div className="m-12 flex flex-col gap-8">
          <div className="font-semibold text-3xl text-blue-800">
            Data Kemiskinan Penduduk Indonesia
          </div>
          <div className="flex flex-row mt-4 gap-8">
            <div className="w-1/5">
              <label htmlFor="level-select" className="font-medium">
                Pilih Tingkat:
              </label>
              <Select
                id="level-select"
                value={level}
                onChange={setLevel}
                options={levelOptions}
                placeholder="Pilih Tingkat..."
                className="mt-2"
              />
            </div>
            <div className="w-1/5">
              <label htmlFor="year-select" className="font-medium">
                Pilih Tahun:
              </label>
              <Select
                id="year-select"
                value={year}
                onChange={handleYearChange}
                options={yearOptions || []}
                placeholder="Pilih Tahun..."
                className="mt-2"
              />
            </div>
            {povertyData && (
              <div className="flex flex-col w-1/4 ml-auto">
                <label htmlFor="filter-input" className="font-medium">
                  Filter Data:
                </label>
                <input
                  id="filter-input"
                  value={filtering}
                  onChange={(e) => setFiltering(e.target.value)}
                  className="mt-2 border border-gray-300 rounded-md p-1.5"
                  placeholder="Search..."
                />
              </div>
            )}
          </div>
          <div>
            {povertyData && (
              <DataTableComponent
                data={povertyData}
                columns={columns}
                filtering={filtering}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPage;
