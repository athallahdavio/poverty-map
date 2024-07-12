import React, { useState, useEffect } from "react";
import Sidebar, { SidebarItem } from "../Components/SidebarComponent";
import { House, Map, BarChart3, BarChart4, Sheet } from "lucide-react";
import BarChartComponent from "../Components/BarChartComponent";
import axios from "axios";
import Select from "react-select";

const RegencyChartPage = () => {
  const [API_URL] = useState(import.meta.env.VITE_API_URL);
  const [regencies, setRegencies] = useState([]);
  const [selectedRegency, setSelectedregency] = useState(null);
  const [povertyData, setPovertyData] = useState(null);
  const [unemployedData, setUnemployedData] = useState(null);
  const [uneducatedData, setUneducatedData] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchRegencies = async () => {
      try {
        const response = await axios.get(API_URL + "/api/regencies");
        const regencyOptions = response.data.map(regency => ({
          value: regency.name,
          label: regency.name
        }));
        setRegencies(regencyOptions);
      } catch (error) {
        console.error("Error fetching regencies:", error);
      }
    };

    fetchRegencies();
  }, [API_URL]);

  useEffect(() => {
    if (selectedRegency) {
      const fetchData = async () => {
        try {
          const response = await axios.get(API_URL + `/api/poverties/regency?name=${selectedRegency.value}`);
          const data = response.data;

          const labels = data.map(item => item.year);

          setPovertyData({
            labels,
            datasets: [
              {
                label: 'Persentase Kemiskinan',
                data: data.map(item => item.poverty_percentage),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
            ],
          });

          setUnemployedData({
            labels,
            datasets: [
              {
                label: 'Persentase Tidak Bekerja',
                data: data.map(item => item.unemployed_percentage),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
              },
            ],
          });

          setUneducatedData({
            labels,
            datasets: [
              {
                label: 'Persentase Tidak Menyelesaikan Pendidikan',
                data: data.map(item => item.uneducated_percentage),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
              },
            ],
          });

          setTableData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [selectedRegency, API_URL]);

  const handleRegencyChange = (selectedOption) => {
    setSelectedregency(selectedOption);
  };

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
          active={true}
        />
        <SidebarItem text={"Data"} icon={<Sheet />} to={"/data"} />
      </Sidebar>
      <div className="h-full w-full">
        <div className="m-12 flex flex-col gap-8">
          <div className="font-semibold text-3xl text-blue-800">
            Grafik Kemiskinan Penduduk Berdasarkan Kabupaten/Kota
          </div>
          <div className="w-1/3 mt-4">
            <label htmlFor="regency-select" className="font-medium">Pilih Kabupaten/Kota:</label>
            <Select
              id="regency-select"
              value={selectedRegency}
              onChange={handleRegencyChange}
              options={regencies}
              placeholder="Pilih Kabupaten/Kota..."
              className="mt-2"
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col rounded shadow-md grow p-4">
              <div className="font-medium text-xl">Persentase Kemiskinan</div>
              {povertyData && <BarChartComponent data={povertyData} />}
            </div>
            <div className="flex flex-col rounded shadow-md grow p-4">
              <div className="font-medium text-xl">Persentase Tidak Bekerja</div>
              {unemployedData && <BarChartComponent data={unemployedData} />}
            </div>
            <div className="flex flex-col rounded shadow-md grow p-4">
              <div className="font-medium text-xl">Persentase Tidak Menyelesaikan Pendidikan</div>
              {uneducatedData && <BarChartComponent data={uneducatedData} />}
            </div>
          </div>
          <div className="">
            <table className="min-w-full bg-white border border-gray-300 rounded">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b bg-gray-100 text-center font-medium">Tahun</th>
                  <th className="py-2 px-4 border-b bg-gray-100 text-center font-medium w-1/3">Persentase Kemiskinan</th>
                  <th className="py-2 px-4 border-b bg-gray-100 text-center font-medium w-1/3">Persentase Tidak Bekerja</th>
                  <th className="py-2 px-4 border-b bg-gray-100 text-center font-medium w-1/3">Persentase Tidak Menyelesaikan Pendidikan</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item) => (
                  <tr key={item.year}>
                    <td className="py-2 px-4 border-b text-center">{item.year}</td>
                    <td className="py-2 px-4 border-b w-1/3">{item.poverty_percentage}%</td>
                    <td className="py-2 px-4 border-b w-1/3">{item.unemployed_percentage}%</td>
                    <td className="py-2 px-4 border-b w-1/3">{item.uneducated_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegencyChartPage;