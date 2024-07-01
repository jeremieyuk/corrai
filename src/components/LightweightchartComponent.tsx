import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  CrosshairMode,
  LineData,
  UTCTimestamp,
} from "lightweight-charts";
import { DatePicker, InputGroup, CustomProvider } from "rsuite";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import "rsuite/dist/rsuite.min.css";

interface PriceData {
  symbol: string;
  time?: string;
  datetime_open_time?: string;
  close: number;
  open: number;
  high: number;
  low: number;
}

interface RandomData {
  time: UTCTimestamp;
  value: number;
}

interface LightweightchartComponentProps {
  symbol: string;
}

const generateRandomData = (startDate: Date, endDate: Date): RandomData[] => {
  const data: RandomData[] = [];
  let currentTime = startDate.getTime() / 1000;
  const endTime = endDate.getTime() / 1000;

  while (currentTime <= endTime) {
    data.push({
      time: currentTime as UTCTimestamp,
      value: Math.random() * (5000 - 1000) + 1000,
    });
    currentTime += 24 * 60 * 60; // Increment by 1 day
  }

  return data;
};

const LightweightchartComponent: React.FC<LightweightchartComponentProps> = ({
  symbol,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2023-01-01")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2024-04-25"));
  const [interval, setInterval] = useState<string>("1d");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 700,
      layout: {
        background: { color: "#0b0b0b" },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: {
          color: "#151515",
        },
        horzLines: {
          color: "#151515",
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: "#d1d4dc",
      },
      leftPriceScale: {
        visible: true,
        borderColor: "#d1d4dc",
      },
      timeScale: {
        borderColor: "#d1d4dc",
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#4caf50",
      downColor: "#f44336",
      borderDownColor: "#f44336",
      borderUpColor: "#4caf50",
      wickDownColor: "#f44336",
      wickUpColor: "#4caf50",
    });

    const randomDataSeries = chart.addLineSeries({
      color: "#ff0000",
      lineWidth: 2,
      priceScaleId: "left",
    });

    const fetchData = async () => {
      try {
        const formattedStartDate = startDate
          ? startDate.toISOString()
          : "2023-01-01T00:00:00";
        const formattedEndDate = endDate
          ? endDate.toISOString()
          : "2024-04-25T00:00:00";
        const response = await fetch(
          `http://localhost:8000/get_symbol_price?start_date=${formattedStartDate}&end_date=${formattedEndDate}&interval=${interval}&symbol=${symbol}`
        );
        const result: PriceData[] = await response.json();

        const formattedData = result.map((item) => ({
          time: (new Date(item.time || item.datetime_open_time!).getTime() /
            1000) as UTCTimestamp,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));

        candlestickSeries.setData(formattedData);

        const randomData = generateRandomData(startDate!, endDate!);
        randomDataSeries.setData(randomData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      chart.remove();
    };
  }, [symbol, startDate, endDate, interval]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <CustomProvider theme="dark">
        <InputGroup style={{ width: 310 }}>
          <DatePicker
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            format="yyyy-MM-dd"
            block
            appearance="subtle"
            placeholder="Start Date"
          />
          <InputGroup.Addon>to</InputGroup.Addon>
          <DatePicker
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            format="yyyy-MM-dd"
            block
            appearance="subtle"
            placeholder="End Date"
          />
        </InputGroup>
      </CustomProvider>

      <FormControl
        sx={{
          m: 1,
          minWidth: 100,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "gray",
            },
            "&:hover fieldset": {
              borderColor: "lightgray",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
            "& .MuiSvgIcon-root": {
              color: "#fff",
            },
          },
        }}
        size="small"
      >
        <Select
          style={{ color: "gray" }}
          value={interval}
          onChange={(event: SelectChangeEvent<string>) =>
            setInterval(event.target.value)
          }
        >
          <MenuItem value="15m">15 Minutes</MenuItem>
          <MenuItem value="30m">30 Minutes</MenuItem>
          <MenuItem value="1h">1 Hour</MenuItem>
          <MenuItem value="4h">4 Hours</MenuItem>
          <MenuItem value="1d">1 Day</MenuItem>
        </Select>
      </FormControl>

      <div ref={chartContainerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default LightweightchartComponent;
