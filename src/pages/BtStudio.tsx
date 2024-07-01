import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ChooseBar from "../components/ChooseBar/ChooseBar"; // Adjust the import path as needed
import HighchartComponent from "../components/Highchart/HighchartComponent";
import LightweightchartComponent from "../components/LightweightchartComponent";
import BtsSideBar from "../components/BtsSideBar/BtsSideBar";
import { FoctorIndicator } from "../types"; // Adjust the import path as needed
import "./BtStudio.css"; // Import your CSS file

const BtStudio: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("a") || "BTC"; // Default to BTC if no token is provided

  // State to manage the selected factors
  const [foctors, setfoctors] = useState<
    {
      foctor_id: string;
      symbol: string;
      foctor_sourse: string[];
      foctor: string;
      foctor_indicator?: FoctorIndicator[];
    }[]
  >([
    {
      foctor_id: "cwiwncwijvnevinvi!832j",
      symbol: token,
      foctor_sourse: ["price_data"],
      foctor: "close",
      foctor_indicator: [],
    },
  ]);

  const [foctorsIndicator, setfoctorsIndicator] = useState<{
    foctor_id?: string;
    symbol?: string;
    foctor_sourse?: string[];
    foctor?: string;
  }>({});

  const [newFactorAdded, setNewFactorAdded] = useState<boolean>(true);

  const [newNewIndicator, setnewNewIndicator] = useState<boolean>(false);

  // Redirect to default URL if no query parameter is present
  useEffect(() => {
    if (!token) {
      navigate("/bt-studio/metrics?a=BTC");
    }
  }, [token, navigate]);

  return (
    <>
      <div className="btstudio-container">
        <ChooseBar symbol={token} foctors={foctors} setfoctors={setfoctors} />
        <div className="bts-content">
          <div className="sidebar">
            <BtsSideBar
              symbol={token}
              foctors={foctors}
              newFactorAdded={newFactorAdded}
              setfoctors={setfoctors}
              setNewFactorAdded={setNewFactorAdded}
              newNewIndicator={newNewIndicator}
              setnewNewIndicator={setnewNewIndicator}
              setfoctorsIndicator={setfoctorsIndicator}
              foctorsIndicator={foctorsIndicator}
            />
          </div>
          <div className="main-charts">
            <HighchartComponent
              symbol={`${token}USDT`}
              foctors={foctors}
              newFactorAdded={newFactorAdded}
              setfoctors={setfoctors}
              setNewFactorAdded={setNewFactorAdded}
              newNewIndicator={newNewIndicator}
              setnewNewIndicator={setnewNewIndicator}
              setfoctorsIndicator={setfoctorsIndicator}
              foctorsIndicator={foctorsIndicator}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BtStudio;
