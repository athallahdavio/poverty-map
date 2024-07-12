import { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import Sidebar, { SidebarItem } from "../Components/SidebarComponent";
import { House, Map, BarChart3, BarChart4, Sheet } from "lucide-react";
import DataTableComponent from "../Components/DataTableComponent";

const DataPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [povertyData, setPovertyData] = useState(null);
  const [year, setYear] = useState({ value: 2020, label: "2020" });
  const [filtering, setFiltering] = useState("");

  useEffect(() => {
    fetch(API_URL + `/api/poverties/regency-poverty-by-year?year=${year.value}`)
      .then((response) => response.json())
      .then((data) => setPovertyData(data));
  }, [year]);

  const columns = [
    {
      header: "Provinsi",
      accessorKey: "province_id.name",
    },
    {
      header: "Kabupaten/Kota",
      accessorKey: "regency_id.name",
    },
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

  const yearOptions = [
    { value: 2020, label: "2020" },
    { value: 2021, label: "2021" },
    { value: 2022, label: "2022" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarItem text={"Beranda"} icon={<House />} to={"/"} />
        <SidebarItem text={"Peta"} icon={<Map />} to={"/map"} />
        <SidebarItem
          text={"Grafik Provinsi"}
          icon={<BarChart3 />}
          to={"/province-chart"}
        />
        <SidebarItem
          text={"Grafik Kabupaten/Kota"}
          icon={<BarChart4 />}
          to={"/regency-chart"}
        />
        <SidebarItem
          text={"Data"}
          icon={<Sheet />}
          to={"/data"}
          active={true}
        />
      </Sidebar>
      <div className="h-full w-full">
        <div className="m-12 flex flex-col gap-8">
          <div className="font-semibold text-3xl text-blue-800">
            Data Kemiskinan Penduduk Indonesia
          </div>
          <div className="flex flex-row mt-4 justify-between">
            <div className="w-1/4">
              <label htmlFor="year-select" className="font-medium">
                Pilih Tahun:
              </label>
              <Select
                id="year-select"
                value={year}
                onChange={setYear}
                options={yearOptions}
                placeholder="Pilih Tahun..."
                className="mt-2"
              />
            </div>
            {povertyData && (
              <div className="flex flex-col w-1/4">
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