import React, { useState, useEffect } from "react";
import Sidebar, { SidebarItem } from "../Components/SidebarComponent";
import { House, Map, BarChart3, BarChart4, Sheet } from "lucide-react";
import BarChartComponent from "../Components/BarChartComponent";
import axios from "axios";
import Select from "react-select";

const ProvinceChartPage = () => {
  const [API_URL] = useState(import.meta.env.VITE_API_URL);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [povertyData, setPovertyData] = useState(null);
  const [unemployedData, setUnemployedData] = useState(null);
  const [uneducatedData, setUneducatedData] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(API_URL + "/api/provinces");
        const provinceOptions = response.data.map(province => ({
          value: province.name,
          label: province.name
        }));
        setProvinces(provinceOptions);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, [API_URL]);

  useEffect(() => {
    if (selectedProvince) {
      const fetchData = async () => {
        try {
          const response = await axios.get(API_URL + `/api/poverties/province?name=${selectedProvince.value}`);
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
  }, [selectedProvince, API_URL]);

  const handleProvinceChange = (selectedOption) => {
    setSelectedProvince(selectedOption);
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
          active={true}
        />
        <SidebarItem
          text={"Grafik Kabupaten/Kota"}
          icon={<BarChart4 />}
          to={"/regency-chart"}
        />
        <SidebarItem text={"Data"} icon={<Sheet />} to={"/data"} />
      </Sidebar>
      <div className="h-full w-full">
        <div className="m-12 flex flex-col gap-8">
          <div className="font-semibold text-3xl text-blue-800">
            Grafik Kemiskinan Penduduk Berdasarkan Provinsi
          </div>
          <div className="w-1/3 mt-4">
            <label htmlFor="province-select" className="font-medium">Pilih Provinsi:</label>
            <Select
              id="province-select"
              value={selectedProvince}
              onChange={handleProvinceChange}
              options={provinces}
              placeholder="Pilih Provinsi..."
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

export default ProvinceChartPage;