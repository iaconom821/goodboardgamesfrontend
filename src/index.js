import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from "redux"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import rootReducer from './components/reducers/rootReducer';


// Barcode Scanner 
// import * as ScanditSDK from 'scandit-sdk';
// import { ScanSettings, Barcode } from 'scandit-sdk';

// const userLicenseKey = 'AXvA6gSlJLaLOMv7eiiBFShF6KLnGGdx73+fhBx78y/ZQmf21zb7PeRUOWeebuTRUnU+vNxHTrV1NCNd33CFpeNBoRlQUdfPfWv0PwNbGQgkFiTFPwJ/dSU31adFINVWjhOJzYmqAcMrHnO01YhsLevJ4nmJiPMs/m0YrDWkXlVpXIyWxfCDxnOBCPQQ7CnM9ZutkrFhuEbJQbbBbOK1Iu8SXJgx9y2iZWbMuwHKB0+2hnGBOskN2LFeszIgmEyHU59ALRgMcat3cUPDvTkprsHiRPs/QL1rn7YgbPOw4O3q1s+gTEERAFN+lVE9nvJc9wboSjPg0T89KQ+c+QfaZYNIZAq4qPWuAIDHVr7oKrch176T8M5t/cNcINCusn/3AcW4oVJ3B4kuWBfcb6Y0v47CQOVbdqrffuSzKFa0g/iw6In8RwBiscrmtOEIKefx8hZF0gChZfblqwMHkkaG8ER50vV6sNDIuuYTJlx/Go7k8zTXmym6IdpRt52ebDF+WmjV3RLsXoqqbug2HNRAV8C9O1qRTlzde4He/EftxP7/rdu5Wg9KWsIeyExaipJEEoKJ38oX03+zuKMhe1QzXFZyvJtLZ5gNoCwsNrZGIZHt02+yx49qWpoXoa0nkCSpYQR4VrZ0V0HMUtCCm9XoqgRMrkKI1axU3rj82KPTM5o3M54nnxhHzL39IPrWyiuG2qz+bQ2kGSUcu2y8Vs02RZp9crU7pgIIDGTu+WAG1jVHGOolxVkBzNvDE6rhAiat/kv4F7xL+RznReKVddEBLgUuvAF3NEEYX3z3ryLYLw=='

// ScanditSDK.configure(userLicenseKey, {
//   engineLocation: "https://cdn.jsdelivr.net/npm/scandit-sdk/build",
// }).then(r=>ScanditSDK.BarcodePicker.create(document.getElementById("scandit-barcode-picker"), {
//   playSoundOnScan: true,
// }).then(function (barcodePicker) {
//   const scanSettings = new ScanSettings({
//     enabledSymbologies: [
//       Barcode.Symbology.EAN8,
//       Barcode.Symbology.EAN13,
//       Barcode.Symbology.UPCA,
//       Barcode.Symbology.UPCE,
//       Barcode.Symbology.CODE128,
//       Barcode.Symbology.CODE39,
//       Barcode.Symbology.CODE93,
//       Barcode.Symbology.INTERLEAVED_2_OF_5,
//     ],
//     codeDuplicateFilter: 1000, // Minimum delay between duplicate results
//   });
//   barcodePicker.applyScanSettings(scanSettings);
//   barcodePicker.on("scan", (scanResult) => {
//       let barCode = scanResult.barcodes.reduce((string, barcode) => {
//         return string + `${Barcode.Symbology.toHumanizedName(barcode.symbology)}: ${barcode.data}\n`;
//       }, "").split("UPC-A: 0")
//       console.log(barCode[1])
//       fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barCode[1]}`, {
//       }).then(r=>r.json()).then(r=>console.log(r))
//   });
// }))


const store = createStore(rootReducer)

ReactDOM.render(

  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
