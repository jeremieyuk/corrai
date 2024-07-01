import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBitcoin, faEthereum } from "@fortawesome/free-brands-svg-icons";
import { ChooseBarProps } from "../../types";

interface Asset {
  symbol: string;
  label: string;
  icon: React.ReactElement;
  path: string;
}

const assets: Asset[] = [
  {
    symbol: "BTC",
    label: "Bitcoin",
    icon: <FontAwesomeIcon icon={faBitcoin} />,
    path: "/bt-studio/metrics?a=BTC",
  },
  {
    symbol: "ETH",
    label: "Ethereum",
    icon: <FontAwesomeIcon icon={faEthereum} />,
    path: "/bt-studio/metrics?a=ETH",
  },
];

const ChooseBar: React.FC<ChooseBarProps> = ({
  symbol,
  foctors,
  setfoctors,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(() => {
    const currentAsset = assets.find((asset) => asset.symbol === symbol);
    return currentAsset ? currentAsset.path : assets[0].path;
  });

  React.useEffect(() => {
    const currentAsset = assets.find((asset) => asset.symbol === symbol);
    if (currentAsset) {
      setValue(currentAsset.path);
    }
  }, [symbol]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: "#0b0b0b",
        boxShadow: "none",
        borderBottom: "0.5px solid #474747 ",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="asset tabs"
        textColor="inherit"
        indicatorColor="secondary"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#fff",
          },
        }}
      >
        {assets.map((asset) => (
          <Tab
            key={asset.label}
            icon={asset.icon}
            label={asset.label}
            value={asset.path}
            iconPosition="start"
            sx={{ minHeight: "48px", fontSize: "13px" }}
          />
        ))}
      </Tabs>
    </AppBar>
  );
};

export default ChooseBar;
