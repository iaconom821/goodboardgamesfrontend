import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ScanditBarcodeScanner from "scandit-sdk-react";
import {
  Barcode,
  ScanSettings,
} from "scandit-sdk";

const StyledDiv = styled.div`
  margin: auto;
  margin-top: 10vh;
  margin-bottom: 10vh;
  background-color: #FCFCD4;
  width: 40vw;
  border-radius: 6px;
  border: 2px solid #344A53;`

const StyledForm = styled.form`
  position: relative;
  margin: auto;
  text-align: center;
  justify-content: center;
  padding: 5px;
`

const StyledLabel = styled.label`
  color: #79B7CF;
  text-align: center;
  margin: 10px;
  font-weight: bold;
  `

const StyledInput = styled.input`
  display: block;
  color: #FCFCD4;
  border-radius: 5px;
  border: 1px solid black;
  text-align: center;
  background-color: #344A53;
  margin: auto;
  box-sizing: border-box;
  `

function NewBoardGame() {
  const [title, setTitle] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [description, setDescription] = useState("");
  const [upcCode, setUpcCode] = useState("");
  const [scanner, setScanner] = useState(false);

  const boardGames = useSelector((state) => state.boardGames);

  const history = useHistory();

  const dispatch = useDispatch();

  function handleNewBoardGame(e) {
    e.preventDefault();

    fetch("http://localhost:3000/api/v1/boardgames", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        title: title,
        manufacturer: manufacturer,
        description: description,
        upc_code: upcCode,
      }),
    })
      .then((res) => res.json())
      .then((newBoardGame) => {
        if (!boardGames) {
          fetch("http://localhost:3000/api/v1/boardgames")
            .then((res) => res.json())
            .then((boardGameList) => {
              dispatch({ type: "setBoardGames", payload: boardGameList });
              history.push(
                `/boardgames/${boardGameList[boardGameList.length - 1].id}`
              );
            });
        } else {
          dispatch({ type: "addBoardGame", payload: newBoardGame });
          history.push(`/boardgames/${newBoardGame.id}`);
        }
      });
  }

  if (!localStorage.token) {
    return <h2>Please Log In or Sign Up</h2>;
  }

  function handleUpcCode(e) {
    fetch("http://localhost:3000/api/v1/scanned_game", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authentication: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        upc_code: e.barcodes[0].data,
      }),
    })
      .then((res) => res.json())
      .then((newBoardGame) => {
        if (!boardGames) {
          fetch("http://localhost:3000/api/v1/boardgames")
            .then((res) => res.json())
            .then((boardGameList) => {
              dispatch({ type: "setBoardGames", payload: boardGameList });
              history.push(
                `/boardgames/${boardGameList[boardGameList.length - 1].id}`
              );
            });
        } else {
          dispatch({ type: "addBoardGame", payload: newBoardGame });
          history.push(`/boardgames/${newBoardGame.id}`);
        }
      });
  }

  const getScanSettings = () => {
    return new ScanSettings({
      enabledSymbologies: [
        Barcode.Symbology.EAN8,
        Barcode.Symbology.EAN13,
        Barcode.Symbology.UPCA,
        Barcode.Symbology.UPCE,
        Barcode.Symbology.CODE128,
        Barcode.Symbology.CODE39,
        Barcode.Symbology.CODE93,
        Barcode.Symbology.INTERLEAVED_2_OF_5,
      ],
    });
  };

  return (
    <StyledDiv>
      <StyledForm onSubmit={handleNewBoardGame}>
        <StyledLabel style={{ fontWeight: "bolder" }}>
          New Boardgame
        </StyledLabel>
        <br />
        <br />
        <StyledLabel>Title</StyledLabel>
        <StyledInput
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <StyledLabel>Manufacturer</StyledLabel>
        <StyledInput
          type="text"
          name="manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />
        <StyledLabel>Description</StyledLabel>
        <StyledInput
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <StyledLabel>UPC Code</StyledLabel>
        <StyledInput
          type="text"
          value={upcCode}
          onChange={(e) => setUpcCode(e.target.value)}
        />
        <StyledInput as="button" type="submit" style={{marginTop: "2vh"}}>
          Submit New Game
        </StyledInput>
      </StyledForm>
      <StyledInput as="button" onClick={(e) => setScanner(!scanner)} style={{marginBottom: "2vh"}}>
        Scan Barcode
      </StyledInput>

      {/* <div id="barcode-scanner"></div>
      {scanner ? <Scanner setUpcCode={handleUpcCode}></Scanner> : null } */}
      {scanner ? (
        <div style={{width: "40vw", marginBottom: "2vh"}}>
        <ScanditBarcodeScanner
          licenseKey="AXvA6gSlJLaLOMv7eiiBFShF6KLnGGdx73+fhBx78y/ZQmf21zb7PeRUOWeebuTRUnU+vNxHTrV1NCNd33CFpeNBoRlQUdfPfWv0PwNbGQgkFiTFPwJ/dSU31adFINVWjhOJzYmqAcMrHnO01YhsLevJ4nmJiPMs/m0YrDWkXlVpXIyWxfCDxnOBCPQQ7CnM9ZutkrFhuEbJQbbBbOK1Iu8SXJgx9y2iZWbMuwHKB0+2hnGBOskN2LFeszIgmEyHU59ALRgMcat3cUPDvTkprsHiRPs/QL1rn7YgbPOw4O3q1s+gTEERAFN+lVE9nvJc9wboSjPg0T89KQ+c+QfaZYNIZAq4qPWuAIDHVr7oKrch176T8M5t/cNcINCusn/3AcW4oVJ3B4kuWBfcb6Y0v47CQOVbdqrffuSzKFa0g/iw6In8RwBiscrmtOEIKefx8hZF0gChZfblqwMHkkaG8ER50vV6sNDIuuYTJlx/Go7k8zTXmym6IdpRt52ebDF+WmjV3RLsXoqqbug2HNRAV8C9O1qRTlzde4He/EftxP7/rdu5Wg9KWsIeyExaipJEEoKJ38oX03+zuKMhe1QzXFZyvJtLZ5gNoCwsNrZGIZHt02+yx49qWpoXoa0nkCSpYQR4VrZ0V0HMUtCCm9XoqgRMrkKI1axU3rj82KPTM5o3M54nnxhHzL39IPrWyiuG2qz+bQ2kGSUcu2y8Vs02RZp9crU7pgIIDGTu+WAG1jVHGOolxVkBzNvDE6rhAiat/kv4F7xL+RznReKVddEBLgUuvAF3NEEYX3z3ryLYLw=="
          engineLocation="https://cdn.jsdelivr.net/npm/scandit-sdk/build"
          scanSettings={getScanSettings()}
          onScan={(e) => handleUpcCode(e)}
          onScanError={console.log}
        />
        </div>
      ) : null}
    </StyledDiv>
  );
}

export default NewBoardGame;
