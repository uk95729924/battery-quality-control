// import { useState } from "react";
// import axios from "axios";
// import Papa from "papaparse";

// import MainLayout from "../layouts/MainLayout";
// import UploadBox from "../dataset/UploadBox";
// import DatasetPreview from "../dataset/DatasetPreview";
// import DatasetStatistics from "../dataset/DatasetStatistics";
// import FeatureSelection from "../dataset/FeatureSelection";



// function UploadDataset() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [dataset, setDataset] = useState([]);

//   const handleFileSelect = async (file) => {
//     setSelectedFile(file);

//     if (!file) return;

//     // ==========================
//     // Upload Dataset to Flask
//     // ==========================

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log(response.data);

//       alert("Dataset Uploaded Successfully");

//     } catch (error) {

//       console.error(error);

//       alert("Upload Failed");

//       return;
//     }

//     // ==========================
//     // CSV Preview
//     // ==========================

//     if (file.name.endsWith(".csv")) {

//       Papa.parse(file, {
//         header: true,
//         skipEmptyLines: true,
//         complete: (results) => {

//           console.log(results.data);

//           setDataset(results.data);

//         },
//       });

//     }

//     else if (file.name.endsWith(".xlsx")) {

//       alert("XLSX Preview will be added later.");

//     }

//   };

//   return (
//     <MainLayout>

//       {/* Header */}

//       <div className="mb-8">

//         <h1 className="text-4xl font-bold">
//           Upload Dataset
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Upload Battery Electrode Quality Dataset
//         </p>

//       </div>

//       {/* Upload Box */}

//       <UploadBox onFileSelect={handleFileSelect} />

//       {/* Selected File */}

//       {selectedFile && (

//         <div className="bg-green-100 border border-green-400 rounded-xl mt-8 p-5">

//           <h2 className="text-xl font-bold mb-3">
//             Selected File
//           </h2>

//           <p>
//             <strong>Name :</strong> {selectedFile.name}
//           </p>

//           <p>
//             <strong>Size :</strong>{" "}
//             {(selectedFile.size / 1024).toFixed(2)} KB
//           </p>

//           <p>
//             <strong>Type :</strong> {selectedFile.type}
//           </p>

//         </div>

//       )}

//       {/* Dataset Preview */}

//       {dataset.length > 0 && (
//         <DatasetPreview data={dataset} />
//       )}

//       {/* Dataset Statistics */}

//       {dataset.length > 0 && (
//         <DatasetStatistics data={dataset} />
//       )}

//       {/* Feature Selection */}

//       {dataset.length > 0 && (
//         <FeatureSelection data={dataset} />
//       )}

//     </MainLayout>
//   );
// }

// export default UploadDataset;






// import { useState, useEffect } from "react";
// import axios from "axios";
// import Papa from "papaparse";

// import MainLayout from "../layouts/MainLayout";
// import UploadBox from "../dataset/UploadBox";
// import DatasetPreview from "../dataset/DatasetPreview";
// import DatasetStatistics from "../dataset/DatasetStatistics";
// import FeatureSelection from "../dataset/FeatureSelection";

// function UploadDataset() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [dataset, setDataset] = useState([]);

//   // ==========================
//   // Debug
//   // ==========================
//   useEffect(() => {
//     console.log("========== DATASET UPDATED ==========");
//     console.log(dataset);
//     console.log("Rows :", dataset.length);

//     if (dataset.length > 0) {
//       console.log("First Row :", dataset[0]);
//     }
//   }, [dataset]);

//   // ==========================
//   // Load Local Storage
//   // ==========================
//   useEffect(() => {
//     const savedDataset = localStorage.getItem("dataset");

//     if (savedDataset) {
//       try {
//         const parsed = JSON.parse(savedDataset);

//         console.log("Loaded From Local Storage");
//         console.log(parsed);

//         setDataset(parsed);
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   }, []);

//   // ==========================
//   // Upload Dataset
//   // ==========================
//   const handleFileSelect = async (file) => {
//     console.log("Selected File :", file);

//     if (!file) {
//       alert("No File Selected");
//       return;
//     }

//     setSelectedFile(file);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:5000/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log(response.data);

//       alert(response.data.message);

//     } catch (err) {
//       console.log(err);
//       alert("Upload Failed");
//       return;
//     }

//     // ==========================
//     // CSV Parse
//     // ==========================

//     alert("Papa Parse Start");

//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,

//       complete: (results) => {

//         alert("Complete Callback");

//         console.log(results);

//         console.log("Rows :", results.data.length);

//         alert("Rows : " + results.data.length);

//         setDataset(results.data);

//         alert("State Updated");

//         localStorage.setItem(
//           "dataset",
//           JSON.stringify(results.data)
//         );

//         localStorage.setItem(
//           "dataset_name",
//           file.name
//         );

//         console.log("Dataset Saved");

//       },

//       error: (err) => {

//         console.log(err);

//         alert("CSV Parsing Failed");

//       }

//     });
//   };

//   return (
//     <MainLayout>

//       <div className="mb-8">

//         <h1 className="text-4xl font-bold">
//           Upload Dataset
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Upload Battery Electrode Quality Dataset
//         </p>

//       </div>

//       <UploadBox onFileSelect={handleFileSelect} />

//       {selectedFile && (

//         <div className="bg-green-100 border border-green-500 rounded-xl mt-8 p-5">

//           <h2 className="text-2xl font-bold">
//             Selected File
//           </h2>

//           <p className="mt-3">
//             <strong>Name :</strong> {selectedFile.name}
//           </p>

//           <p>
//             <strong>Size :</strong>{" "}
//             {(selectedFile.size / 1024).toFixed(2)} KB
//           </p>

//           <p>
//             <strong>Type :</strong> {selectedFile.type}
//           </p>

//         </div>

//       )}

//       {/* ==========================
//           DEBUG BOX
//       ========================== */}

//       <div
//         className="bg-yellow-100 rounded-xl p-5 mt-8 border-2 border-yellow-500"
//       >

//         <h2 className="text-2xl font-bold">
//           Debug Information
//         </h2>

//         <p className="mt-3">
//           Dataset Length :
//           <strong> {dataset.length}</strong>
//         </p>

//         <p>
//           Selected File :
//           <strong>
//             {" "}
//             {selectedFile ? selectedFile.name : "No File"}
//           </strong>
//         </p>

//       </div>

//       {/* ==========================
//           Dataset Components
//       ========================== */}

//       {Array.isArray(dataset) && dataset.length > 0 ? (

//         <>

//           <DatasetPreview
//             data={dataset}
//           />

//           <DatasetStatistics
//             data={dataset}
//           />

//           <FeatureSelection
//             data={dataset}
//           />

//         </>

//       ) : (

//         <div
//           className="bg-red-100 border border-red-500 rounded-xl mt-8 p-6"
//         >

//           <h2 className="text-2xl font-bold text-red-700">
//             No Dataset Loaded
//           </h2>

//           <p className="mt-3">
//             dataset.length = {dataset.length}
//           </p>

//         </div>

//       )}

//     </MainLayout>
//   );
// }

// export default UploadDataset;



import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import UploadBox from "../dataset/UploadBox";
import DatasetPreview from "../dataset/DatasetPreview";
import DatasetStatistics from "../dataset/DatasetStatistics";
import FeatureSelection from "../dataset/FeatureSelection";

import Papa from "papaparse";
import axios from "axios";

function UploadDataset() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataset, setDataset] = useState([]);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);

    if (!file) return;

    // --------------------------
    // Upload File to Flask
    // --------------------------
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      alert("Dataset Uploaded Successfully!");
    } catch (error) {
      console.error(error);

      alert("Upload Failed");
    }

    // --------------------------
    // Preview CSV in React
    // --------------------------

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setDataset(results.data);
        },
      });
    } else if (file.name.endsWith(".xlsx")) {
      alert("XLSX Preview will be added later.");
    }
  };

  return (
    <MainLayout>

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Upload Dataset
        </h1>

        <p className="text-gray-500 mt-2">
          Upload Battery Electrode Quality Dataset
        </p>

      </div>

      {/* Upload Box */}

      <UploadBox onFileSelect={handleFileSelect} />

      {/* Selected File */}

      {selectedFile && (

        <div className="bg-green-100 border border-green-400 rounded-xl mt-8 p-5">

          <h2 className="text-xl font-bold mb-3">
            Selected File
          </h2>

          <p>
            <strong>Name :</strong> {selectedFile.name}
          </p>

          <p>
            <strong>Size :</strong>{" "}
            {(selectedFile.size / 1024).toFixed(2)} KB
          </p>

          <p>
            <strong>Type :</strong> {selectedFile.type}
          </p>

        </div>

      )}

      {/* Dataset Preview */}

      {dataset.length > 0 && (
        <DatasetPreview data={dataset} />
      )}

      {/* Dataset Statistics */}

      {dataset.length > 0 && (
        <DatasetStatistics data={dataset} />
      )}

      {/* Feature Selection */}

      {dataset.length > 0 && (
        <FeatureSelection data={dataset} />
      )}

    </MainLayout>
  );
}

export default UploadDataset;