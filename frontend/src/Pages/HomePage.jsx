import React, { useState, useEffect } from "react";
import Sidebar, { SidebarItem } from "../Components/SidebarComponent";
import { House, Map, BarChart3, Database } from "lucide-react";
import LandingPage from "../assets/landing-page.png";
import axios from "axios";
import BarChartComponent from "../Components/BarChartComponent";
import { ClipLoader } from "react-spinners";
// import { Link } from "react-router-dom";

const HomePage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [povertyData, setPovertyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartData = {
    labels: ["2021", "2022", "2023"],
    datasets: [
      {
        label: "Persentase Kemiskinan",
        data: [10.14, 9.54, 9.36],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Line Example",
        data: [10.14, 9.54, 9.36],
        borderColor: "rgba(0, 0, 0, 1)",
        type: "line",
      },
    ],
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const year = 2023;
    axios
      .get(API_URL + `/api/poverties/overall/${year}`)
      .then((response) => {
        setPovertyData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching poverty data:", error);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center my-auto">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-row">
      <Sidebar>
        <SidebarItem text={"Beranda"} icon={<House />} to={"/"} active={true} />
        <SidebarItem text={"Peta"} icon={<Map />} to={"/map"} />
        <SidebarItem text={"Grafik"} icon={<BarChart3 />} to={"/chart"} />
        <SidebarItem text={"Data"} icon={<Database />} to={"/data"} />
      </Sidebar>
      <div className="h-full w-full flex flex-col">
        <section className="relative">
          <img
            src={LandingPage}
            alt="poverty"
            className="h-screen w-full object-cover"
          />
          <div className="h-screen flex flex-col mx-20 w-3/5 justify-center absolute top-0 left-0 gap-8">
            <div className="text-5xl font-bold text-white">
              Selamat Datang di Poverty Map
            </div>
            <div className="text-xl font-normal text-white">
              Selamat datang di situs yang didedikasikan untuk memberikan
              informasi tentang kemiskinan di Indonesia dengan menggunakan
              teknologi Sistem Informasi Geografis (SIG). Situs ini bertujuan
              untuk memberikan wawasan, data, dan analisis yang mendalam
              mengenai isu kemiskinan di berbagai wilayah Indonesia. Dengan
              adanya informasi ini, diharapkan dapat membantu dalam penyusunan
              kebijakan, penelitian, dan upaya pengentasan kemiskinan.
            </div>
            <div>
              <a
                href="#overall"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                Mulai Jelajahi
              </a>
            </div>
          </div>
        </section>
        <section className="flex flex-row relative" id="overall">
          <div className="flex flex-col my-8 mx-10 gap-8 w-full">
            <div className="text-4xl font-semibold text-blue-800">
              Rangkuman Data
            </div>
            <div className="flex flex-row gap-5">
              <div className="flex flex-col w-1/2 gap-5 h-full">
                <div className="flex flex-col shadow-md border p-5 h-56 w-full">
                  <div className="text-2xl font-medium">
                    Jumlah Penduduk Miskin Indonesia
                  </div>
                  <div className="text-center text-4xl my-auto">
                    {formatNumber(povertyData.totalPovertyAmount)}
                  </div>
                </div>
                <div className="flex flex-col shadow-md border p-5 h-2/3 w-full">
                  <div className="text-2xl font-medium">
                    Grafik Persentase Kemiskinan 3 Tahun Terakhir
                  </div>
                  <div className="mt-8">
                    <BarChartComponent data={chartData} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 w-1/2 h-full">
                <div className="flex flex-col shadow-md border p-5 h-56 w-76 justify-between">
                  <div className="text-lg font-medium">
                    Provinsi dengan Persentase Penduduk Miskin Tertinggi
                  </div>
                  <div className="ml-auto text-right text-lg">
                    {povertyData.highestPovertyProvince.province_id.name}
                    <br />
                    {povertyData.highestPovertyProvince.poverty_percentage}%
                  </div>
                </div>
                <div className="flex flex-col shadow-md border p-5 h-56 w-76 justify-between">
                  <div className="text-lg font-medium">
                    Kabupaten/Kota dengan Persentase Penduduk Miskin Tertinggi
                  </div>
                  <div className="ml-auto text-right text-lg">
                    {povertyData.highestPovertyRegency.regency_id.name}
                    <br />
                    {povertyData.highestPovertyRegency.poverty_percentage}%
                  </div>
                </div>
                <div className="flex flex-col shadow-md border p-5 h-56 w-76 justify-between">
                  <div className="text-lg font-medium">
                    Provinsi dengan Persentase Penduduk Miskin Tidak Bekerja
                    Tertinggi
                  </div>
                  <div className="ml-auto text-right text-lg">
                    {povertyData.highestUnemployedProvince.province_id.name}
                    <br />
                    {
                      povertyData.highestUnemployedProvince
                        .unemployed_percentage
                    }
                    %
                  </div>
                </div>
                <div className="flex flex-col shadow-md border p-5 h-56 w-76 justify-between">
                  <div className="text-lg font-medium">
                    Kabupaten/Kota dengan Persentase Penduduk Miskin Tidak
                    Bekerja Tertinggi
                  </div>
                  <div className="ml-auto text-right text-lg">
                    {povertyData.highestUnemployedRegency.regency_id.name}
                    <br />
                    {povertyData.highestUnemployedRegency.unemployed_percentage}
                    %
                  </div>
                </div>
                <div className="flex flex-col shadow-md border p-5 h-56 w-76 justify-between">
                  <div className="text-lg font-medium">
                    Provinsi dengan Persentase Penduduk Miskin Tidak
                    Menyelesaikan Pendidikan Tertinggi
                  </div>
                  <div className="ml-auto text-right text-lg">
                    {povertyData.highestUneducatedProvince.province_id.name}
                    <br />
                    {
                      povertyData.highestUneducatedProvince
                        .uneducated_percentage
                    }
                    %
                  </div>
                </div>
                <div className="flex flex-col shadow-md border p-5 h-56 w-76 justify-between">
                  <div className="text-lg font-medium">
                    Kabupaten/Kota dengan Persentase Penduduk Miskin Tidak
                    Menyelesaikan Pendidikan Tertinggi
                  </div>
                  <div className="ml-auto text-right text-lg">
                    {povertyData.highestUneducatedRegency.regency_id.name}
                    <br />
                    {povertyData.highestUneducatedRegency.uneducated_percentage}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="flex flex-row relative">
          <div className="w-2/5"></div>
          <div className="h-screen flex flex-col mx-20 justify-center w-3/5 gap-8">
            <div className="text-4xl font-semibold text-blue-800">
              Peta Kemiskinan
            </div>
            <div className="text-2xl text-blue-800 self-end">
              Di halaman Peta Kemiskinan, Anda dapat melihat distribusi
              kemiskinan di seluruh wilayah Indonesia secara visual. Peta
              interaktif ini memungkinkan Anda untuk mengeksplorasi data
              kemiskinan berdasarkan provinsi, kabupaten, dan kota. Dengan fitur
              ini, Anda dapat dengan mudah memahami sebaran dan intensitas
              kemiskinan di berbagai daerah. Informasi yang ditampilkan meliputi
              persentase kemiskinan, jumlah penduduk miskin, dan perubahan dari
              tahun ke tahun.
            </div>
            <div>
              <Link
                to={"/map"}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                Jelajahi Peta
              </Link>
            </div>
          </div>
        </section>
        <section className="flex flex-row relative">
          <div className="h-screen flex flex-col mx-20 w-3/5 justify-center gap-8">
            <div className="text-4xl font-semibold text-blue-800">
              Grafik Kemiskinan
            </div>
            <div className="text-2xl text-blue-800">
              Halaman Grafik Kemiskinan menyajikan data dalam bentuk visual yang
              mudah dipahami. Anda dapat menemukan berbagai grafik yang
              menampilkan tren kemiskinan dari waktu ke waktu dan analisis
              berdasarkan berbagai faktor seperti pendidikan dan pekerjaan.
              Grafik ini membantu dalam melihat pola-pola dan dinamika
              kemiskinan, serta mempermudah dalam mengidentifikasi faktor-faktor
              yang mempengaruhi kondisi kemiskinan di Indonesia.
            </div>
            <div>
              <Link
                to={"/chart"}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                Jelajahi Grafik
              </Link>
            </div>
          </div>
          <div className="w-2/5"></div>
        </section>
        <section className="flex flex-row relative">
          <div className="w-2/5"></div>
          <div className="h-screen flex flex-col mx-20 w-3/5 justify-center gap-8">
            <div className="text-4xl font-semibold text-blue-800">
              Data Kemiskinan
            </div>
            <div className="text-2xl text-blue-800">
              Halaman Data Kemiskinan menyediakan akses ke database yang kaya
              dengan data mengenai kemiskinan di Indonesia. Data yang tersedia
              mencakup berbagai indikator kemiskinan, seperti jumlah penduduk
              miskin, persentase penduduk miskin, persentase penduduk miskin
              yang tidak bekerja, dan persentase penduduk miskin yang tidak
              menyelesaikan pendidikan. Dengan data yang terperinci, kami
              berharap dapat mendukung upaya-upaya dalam mengurangi kemiskinan
              di Indonesia.
            </div>
            <div>
              <Link
                to={"/data"}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                Jelajahi Data
              </Link>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default HomePage;
