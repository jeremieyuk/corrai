import React, { useState } from "react";
import { Tree } from "rsuite";
import FolderFillIcon from "@rsuite/icons/FolderFill";
import LineChartIcon from "@rsuite/icons/LineChart";
import "./BtsSideBar.css"; // Import the CSS file
import "rsuite/Tree/styles/index.css";
import { BtsSideBarProps } from "../../types";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";

const generateRandomId = () => {
  return "id-" + Math.random().toString(36);
};

const BtsSideBar: React.FC<BtsSideBarProps> = ({
  symbol,
  foctors,
  setfoctors,
  setNewFactorAdded,
  setnewNewIndicator,
  newNewIndicator,
  foctorsIndicator,
  setfoctorsIndicator,
}) => {
  const data = [
    {
      label: "Price data",
      value: "price_data",
      children: [
        {
          label: "open",
          value: "open",
        },
        {
          label: "high",
          value: "high",
        },
        {
          label: "low",
          value: "low",
        },
        {
          label: "close",
          value: "close",
        },
      ],
    },
    {
      label: "Address",
      value: "Address",
      children: [
        {
          label: "Address Activity",
          value: "address_activity",
          children: [
            {
              label: "Active Address",
              value: "active_address",
            },
            {
              label: "Sending Address",
              value: "sending_address",
            },
          ],
        },
        {
          label: "Address Balances",
          value: "address_balances",
          children: [
            {
              label: "Active Address_Balances",
              value: "active_address_Balances",
            },
            {
              label: "Sending Address_Balances_2",
              value: "sending_address_Balances_2",
            },
          ],
        },
      ],
    },
  ];

  const indicatorData = [
    {
      label: "Momentum Indicators",
      value: "Momentum Indicators",
      children: [
        {
          label: "MACD",
          value: "MACD",
          payload: { fastperiod: 12, slowperiod: 26, signalperiod: 9 },
        },
      ],
    },
    {
      label: "Overlap Studies",
      value: "Overlap Studies",
      children: [
        {
          label: "SMA",
          value: "SMA",
          payload: { timeperiod: 30 },
        },
      ],
    },
  ];

  const findNodePath = (
    nodeValue: string,
    treeData: any[],
    path: string[] = []
  ): string[] | null => {
    for (let node of treeData) {
      const currentPath = [...path, node.value];
      if (node.value === nodeValue) {
        return currentPath;
      }
      if (node.children) {
        const childPath = findNodePath(nodeValue, node.children, currentPath);
        if (childPath) {
          return childPath;
        }
      }
    }
    return null;
  };

  const handleNodeClick = (node: any) => {
    setNewFactorAdded(true);
    if (!node.children) {
      const newFoctors = foctors.filter((f) => f.symbol !== node.value);
      const nodePath = findNodePath(node.value, data);
      if (nodePath) {
        if (newFoctors.length < 2) {
          setfoctors([
            ...newFoctors,
            {
              foctor_id: generateRandomId(),
              symbol: symbol,
              foctor_sourse: nodePath.slice(0, -1), // Exclude the last element to get the source path
              foctor: node.value,
            },
          ]);
        } else {
          alert("Over 2 foctors");
        }
      }
    }
  };

  const handleAddIndicator = (node: any) => {
    const updateFoctorIndicator = (foctorId: any, newIndicator: any) => {
      setfoctors((prevFoctors) =>
        prevFoctors.map((foctor) =>
          foctor.foctor_id === foctorId
            ? {
                ...foctor,
                foctor_indicator: [
                  ...(foctor.foctor_indicator || []),
                  newIndicator,
                ],
              }
            : foctor
        )
      );
    };

    const targetFoctor = foctors.find(
      (foctor) => foctor.foctor_id === foctorsIndicator.foctor_id
    );

    if (targetFoctor && (targetFoctor.foctor_indicator || []).length < 3) {
      updateFoctorIndicator(targetFoctor.foctor_id, {
        symbol: targetFoctor.symbol,
        foctor: targetFoctor.foctor,
        foctor_sourse: targetFoctor.foctor_sourse,
        id: node.value + generateRandomId(),
        label: node.value,
        payload: node.payload,
      });
      console.log("Indicator added:", node, foctorsIndicator, foctors);
    } else {
      alert("Over 3 foctorsIndicator");
    }
  };

  return (
    <div className="tree-container">
      {!newNewIndicator ? (
        <Tree
          className="custom-tree"
          searchable
          height={800}
          //@ts-ignore
          data={data}
          showIndentLine
          defaultExpandItemValues={["price_data", "close"]}
          renderTreeNode={(node) => {
            return (
              <div
                style={
                  foctors.some(
                    (f) => f.foctor === node.value && f.symbol === symbol
                  )
                    ? {
                        backgroundColor: "#202020",
                        border: "1px solid #474747",
                        borderRadius: 5,

                        paddingInline: 10,
                      }
                    : {}
                }
                onClick={() => handleNodeClick(node)}
              >
                {node.children ? <FolderFillIcon /> : <LineChartIcon />}{" "}
                {node.label}
              </div>
            );
          }}
        />
      ) : (
        <>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingInline: 20,
              }}
            >
              <div
                className="back_ward_button"
                onClick={() => {
                  setnewNewIndicator(false);
                }}
              >
                <FontAwesomeIcon style={{ margin: 10 }} icon={faArrowLeft} />
              </div>

              <div>
                {foctorsIndicator.symbol} {foctorsIndicator.foctor} | Indicators
              </div>
            </div>

            <div className="Indicator_list">
              <Tree
                className="custom-tree"
                searchable
                height={800}
                draggable={true}
                //@ts-ignore
                data={indicatorData}
                showIndentLine
                renderTreeNode={(node) => {
                  return (
                    <>
                      <div
                        className="Indicator_list_items"
                        onClick={
                          node.children
                            ? undefined
                            : () => handleAddIndicator(node)
                        }
                      >
                        {node.children ? (
                          <>
                            <FolderFillIcon />
                          </>
                        ) : (
                          <>
                            <LineChartIcon />
                          </>
                        )}{" "}
                        {node.label}
                      </div>
                    </>
                  );
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BtsSideBar;
