import React from "react";
import Sidebar, { SidebarItem } from "../Components/SidebarComponent";
import { House, Map, BarChart3, BarChart4, Sheet } from "lucide-react";
import LandingPage from "../assets/landing-page.png";

const HomePage = () => {
  return (
    <div className="h-full flex flex-row">
      <Sidebar>
        <SidebarItem text={"Beranda"} icon={<House />} to={"/"} active={true} />
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
        <SidebarItem text={"Data"} icon={<Sheet />} to={"/data"} />
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
              Selamat datang di situs resmi yang didedikasikan untuk memberikan
              informasi komprehensif tentang kemiskinan di Indonesia. Situs ini
              bertujuan untuk memberikan wawasan, data, dan analisis yang
              mendalam mengenai isu kemiskinan di berbagai wilayah Indonesia.
              Dengan adanya informasi ini, diharapkan dapat membantu dalam
              penyusunan kebijakan, penelitian, dan upaya pengentasan
              kemiskinan.
            </div>
            <div>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                Mulai Jelajahi
              </button>
            </div>
          </div>
        </section>
        <section className="flex flex-row relative">
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
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                Jelajahi Peta
              </button>
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
              menampilkan tren kemiskinan dari waktu ke waktu, perbandingan
              antar daerah, dan analisis berdasarkan berbagai faktor seperti
              usia, pendidikan, dan pekerjaan. Grafik ini membantu dalam melihat
              pola-pola dan dinamika kemiskinan, serta mempermudah dalam
              mengidentifikasi faktor-faktor yang mempengaruhi kondisi
              kemiskinan di Indonesia.
            </div>
            <div>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                Jelajahi Grafik
              </button>
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
              dengan data statistik mengenai kemiskinan di Indonesia. Data yang
              tersedia mencakup berbagai indikator kemiskinan, seperti tingkat
              kemiskinan, garis kemiskinan, dan profil rumah tangga miskin. Anda
              dapat mengunduh data dalam berbagai format untuk keperluan
              penelitian, analisis, dan pelaporan. Dengan data yang terperinci
              dan terverifikasi, kami berharap dapat mendukung upaya-upaya dalam
              mengurangi kemiskinan di Indonesia.
            </div>
            <div>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                Jelajahi Data
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
