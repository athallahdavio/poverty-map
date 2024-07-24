import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar, { SidebarItem } from "../Components/SidebarComponent";
import { Database, LogOut } from "lucide-react";
import Select from "react-select";
import DataTableComponent from "../Components/DataTableComponent";
import Modal from "react-modal";
import axios from "axios";
import { Helmet } from "react-helmet";

const AdminPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [povertyData, setPovertyData] = useState(null);
  const [year, setYear] = useState({ value: 2023, label: "2023" });
  const [yearOptions, setYearOptions] = useState(null);
  const [level, setLevel] = useState({ value: "province", label: "Provinsi" });
  const [filtering, setFiltering] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formLevel, setFormLevel] = useState({
    value: "province",
    label: "Provinsi",
  });
  const [formData, setFormData] = useState({
    _id: null,
    year: "",
    province: "",
    regency: "",
    poverty_amount: "",
    poverty_percentage: "",
    unemployed_percentage: "",
    uneducated_percentage: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

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
  }, [API_URL, level, successMessage]);

  useEffect(() => {
    const fetchProvincesAndRegencies = async () => {
      try {
        const provincesResponse = await axios.get(`${API_URL}/api/provinces`);
        const regenciesResponse = await axios.get(`${API_URL}/api/regencies`);

        setProvinces(
          provincesResponse.data.map((province) => ({
            value: province.name,
            label: province.name,
          }))
        );
        setRegencies(
          regenciesResponse.data.map((regency) => ({
            value: regency.name,
            label: regency.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching provinces and regencies:", error);
      }
    };

    fetchProvincesAndRegencies();
  }, [API_URL]);

  useEffect(() => {
    const actionColumns = [
      {
        header: "Aksi",
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdate(row.original)}
                className="bg-yellow-500 text-white px-2 py-1 w-14 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(row.original._id)}
                className="bg-red-500 text-white px-2 py-1 w-14 rounded"
              >
                Hapus
              </button>
            </div>
          );
        },
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
        ...actionColumns,
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
        ...actionColumns,
      ]);
    }

    fetchPovertyData();
  }, [year, yearOptions, level, API_URL]);

  const fetchPovertyData = () => {
    const endpoint =
      level.value === "province"
        ? "/api/poverties/province/year"
        : "/api/poverties/regency/year";

    fetch(API_URL + `${endpoint}?year=${year.value}`)
      .then((response) => response.json())
      .then((data) => setPovertyData(data));
  };

  const levelOptions = [
    { value: "province", label: "Provinsi" },
    { value: "regency", label: "Kabupaten/Kota" },
  ];

  const handleOpenModal = () => setModalIsOpen(true);
  const handleCloseModal = () => {
    setModalIsOpen(false);
    setFormData({
      id: null,
      year: "",
      province: "",
      regency: "",
      poverty_amount: "",
      poverty_percentage: "",
      unemployed_percentage: "",
      uneducated_percentage: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = (data) => {
    setFormData({
      _id: data._id,
      year: data.year,
      province: data.province_id.name,
      regency: data.regency_id ? data.regency_id.name : "",
      poverty_amount: data.poverty_amount,
      poverty_percentage: data.poverty_percentage,
      unemployed_percentage: data.unemployed_percentage,
      uneducated_percentage: data.uneducated_percentage,
    });
    setFormLevel({
      value: data.regency_id ? "regency" : "province",
      label: data.regency_id ? "Kabupaten/Kota" : "Provinsi",
    });
    setModalIsOpen(true);
  };

  const handleDelete = (id) => {
    const endpoint =
      level.value === "province"
        ? "/api/poverties/province"
        : "/api/poverties/regency";

    axios
      .delete(`${API_URL}${endpoint}/${id}`)
      .then((response) => {
        setSuccessMessage("Data deleted successfully");
        console.log("Data deleted successfully:", response.data);
        setYear({ value: 2023, label: "2023" });
        fetchPovertyData();
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error(
          "Error deleting data:",
          error.response ? error.response.data : error.message
        );
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const endpoint =
      formLevel.value === "province"
        ? "/api/poverties/province"
        : "/api/poverties/regency";
    const method = formData._id ? "put" : "post";

    const formDataToSend = {
      year: Number(formData.year),
      province_name: formData.province,
      poverty_amount: Number(formData.poverty_amount),
      poverty_percentage: Number(formData.poverty_percentage),
      unemployed_percentage: Number(formData.unemployed_percentage),
      uneducated_percentage: Number(formData.uneducated_percentage),
    };

    if (formLevel.value === "regency") {
      formDataToSend.regency_name = formData.regency;
    }

    const url = `${API_URL}${endpoint}${
      method === "put" ? `/${formData._id}` : ""
    }`;

    axios({
      method,
      url,
      data: formDataToSend,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setSuccessMessage(
          `Data ${method === "put" ? "updated" : "added"} successfully`
        );
        console.log("Data submitted successfully:", response.data);
        handleCloseModal();
        fetchPovertyData();
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error(
          "Error submitting data:",
          error.response ? error.response.data : error.message
        );
        setErrorMessage(error.response.data.message);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <div className="h-full flex flex-row">
      <Helmet>
        <title>Poverty Map | Admin</title>
      </Helmet>
      <Sidebar>
        <SidebarItem
          text={"Data"}
          icon={<Database />}
          to={"/admin"}
          active={true}
        />
        <SidebarItem
          text={"Logout"}
          icon={<LogOut />}
          to={"/"}
          onClick={handleLogout}
        />
      </Sidebar>
      <div className="h-full w-full">
        <div className="m-12 flex flex-col gap-8">
          <div className="font-semibold text-3xl text-blue-800">
            Data Kemiskinan Penduduk Indonesia
          </div>
          <button
            className="self-start bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleOpenModal}
          >
            Tambah Data
          </button>
          {successMessage && (
            <div className="mb-4 p-2 bg-green-100 border border-green-300 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          <div className="flex flex-row gap-8">
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
                onChange={setYear}
                options={yearOptions}
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
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCloseModal}
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75"
          >
            <div className="bg-white rounded-lg p-6 w-1/2">
              <h2 className="text-2xl font-semibold mb-4">
                Tambah Data Kemiskinan
              </h2>
              {errorMessage && (
                <div className="mb-4 p-2 bg-red-100 border border-red-300 text-red-700 rounded">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col">
                  Pilih Tingkat:
                  <Select
                    name="formLevel"
                    value={formLevel}
                    onChange={setFormLevel}
                    options={levelOptions}
                    placeholder="Pilih Tingkat..."
                    className="mt-2 w-52"
                  />
                </label>
                {formLevel.value === "province" && (
                  <label className="flex flex-col">
                    Provinsi:
                    <Select
                      name="province"
                      value={provinces.find(
                        (p) => p.value === formData.province
                      )}
                      onChange={(selectedOption) =>
                        setFormData({
                          ...formData,
                          province: selectedOption.value,
                        })
                      }
                      options={provinces}
                      placeholder="Pilih Provinsi..."
                      className="mt-2"
                    />
                  </label>
                )}
                {formLevel.value === "regency" && (
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col">
                      Provinsi:
                      <Select
                        name="province"
                        value={provinces.find(
                          (p) => p.value === formData.province
                        )}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            province: selectedOption.value,
                          })
                        }
                        options={provinces}
                        placeholder="Pilih Provinsi..."
                        className="mt-2"
                      />
                    </label>
                    <label className="flex flex-col">
                      Kabupaten/Kota:
                      <Select
                        name="regency"
                        value={regencies.find(
                          (r) => r.value === formData.regency
                        )}
                        onChange={(selectedOption) =>
                          setFormData({
                            ...formData,
                            regency: selectedOption.value,
                          })
                        }
                        options={regencies}
                        placeholder="Pilih Kabupaten/Kota..."
                        className="mt-2"
                      />
                    </label>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    Tahun:
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 mt-2"
                    />
                  </label>
                  <label className="flex flex-col">
                    Jumlah Penduduk Miskin:
                    <input
                      type="number"
                      name="poverty_amount"
                      value={formData.poverty_amount}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 mt-2"
                    />
                  </label>
                </div>
                <label className="flex flex-col">
                  Persentase Kemiskinan:
                  <input
                    type="number"
                    step="0.01"
                    name="poverty_percentage"
                    value={formData.poverty_percentage}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mt-2"
                  />
                </label>
                <label className="flex flex-col">
                  Persentase Tidak Bekerja:
                  <input
                    type="number"
                    step="0.01"
                    name="unemployed_percentage"
                    value={formData.unemployed_percentage}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mt-2"
                  />
                </label>
                <label className="flex flex-col">
                  Persentase Tidak Menyelesaikan Pendidikan:
                  <input
                    type="number"
                    step="0.01"
                    name="uneducated_percentage"
                    value={formData.uneducated_percentage}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2 mt-2"
                  />
                </label>
                <div className="flex justify-end gap-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
