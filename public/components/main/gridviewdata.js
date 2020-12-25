// import '@elastic/eui/dist/eui_theme_dark.css';
import "@elastic/eui/dist/eui_theme_light.css";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext
} from "react";

import {
  EuiDataGrid,
  EuiLink,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
  EuiPopoverTitle,
  EuiButtonIcon,
  EuiSpacer,
  EuiTitle,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiText
} from "@elastic/eui";
import { FormattedMessage } from '@kbn/i18n/react';

export function GridViewData() {

  const DataContext = createContext();

  const raw_data = [];

  const data = [
    { name: "service1", codeCoverage: "76 ⇿" },
    { name: "service2", codeCoverage: "84.6 ↓" },
    { name: "service3", codeCoverage: "11.3 ⇿" }
  ];

  for (let i = 0; i < data.length; i++) {
    raw_data.push({
      service: data[i]["humanFriendlyServiceName"],
      code_coverage:
        data[i]["codeCoverage"] != null ? data[i]["codeCoverage"] : "No data",
      build_duration:
        data[i]["buildDuration"] != null ? data[i]["buildDuration"] : "No data",
      test_success_rate:
        data[i]["testsSuccessRate"] != null
          ? data[i]["testsSuccessRate"]
          : "No data",
      deployment_frequency:
        data[i]["deploymentFrequency"] != null
          ? data[i]["deploymentFrequency"]
          : "No data",
      change_failure_rate:
        data[i]["changeFailureRate"] != null
          ? data[i]["changeFailureRate"]
          : "No data"
    });
  }

  console.log(JSON.stringify(raw_data));

  const columns = [
    {
      id: "service",
      displayAsText: "Service",
      defaultSortDirection: "asc",
      cellActions: [
        ({ rowIndex, columnId, Component }) => {
          const data = useContext(DataContext);
          return (
            <Component
              onClick={() => alert(`Hi ${data[rowIndex][columnId].raw}`)}
              iconType="heart"
              aria-label={`Say hi to ${data[rowIndex][columnId].raw}!`}
            >
              Say hi
            </Component>
          );
        },
        ({ rowIndex, columnId, Component }) => {
          const data = useContext(DataContext);
          return (
            <Component
              onClick={() => alert(`Bye ${data[rowIndex][columnId].raw}`)}
              iconType="moon"
              aria-label={`Say bye to ${data[rowIndex][columnId].raw}!`}
            >
              Say bye
            </Component>
          );
        }
      ]
    },
    {
      id: "code_coverage",
      displayAsText: "Code Coverage %",
      initialWidth: 150,
      cellActions: [
        ({ rowIndex, columnId, Component }) => {
          const data = useContext(DataContext);
          return (
            <Component
              onClick={() => alert(data[rowIndex][columnId].raw)}
              iconType="email"
              aria-label={`Send email to ${data[rowIndex][columnId].raw}`}
            >
              Send email
            </Component>
          );
        }
      ]
    },
    {
      id: "build_duration",
      displayAsText: "Build Duration (95 percentile)",
      initialWidth: 250
    },
    {
      id: "test_success_rate",
      displayAsText: "Test Success Rate %",
      initialWidth: 180,
      actions: {
        showHide: { label: "Custom hide label" },
        showMoveLeft: false,
        showMoveRight: false,
        additional: [
          {
            label: "Custom action",
            onClick: () => {},
            iconType: "cheer",
            size: "xs",
            color: "text"
          }
        ]
      },
      cellActions: [
        ({ rowIndex, columnId, Component, isExpanded }) => {
          const data = useContext(DataContext);
          const onClick = isExpanded
            ? () =>
                alert(`Sent money to ${data[rowIndex][columnId]} when expanded`)
            : () =>
                alert(
                  `Sent money to ${data[rowIndex][columnId]} when not expanded`
                );
          return (
            <Component
              onClick={onClick}
              iconType="faceHappy"
              aria-label={`Send money to ${data[rowIndex][columnId]}`}
            >
              Send money
            </Component>
          );
        }
      ]
    },
    {
      id: "deployment_frequency",
      displayAsText: "Deployment Frequency %",
      initialWidth: 200,
      defaultSortDirection: "desc"
    },
    {
      id: "change_failure_rate",
      displayAsText: "Change Failure Rate %",
      initialWidth: 200
    }
  ];

  console.log("Columns: " + JSON.stringify(columns));

  const GridViewDataTable = () => {
    // ** Pagination config
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const onChangeItemsPerPage = useCallback(
      (pageSize) =>
        setPagination((pagination) => ({
          ...pagination,
          pageSize,
          pageIndex: 0
        })),
      [setPagination]
    );
    console.log("Passed 1");
    const onChangePage = useCallback(
      (pageIndex) =>
        setPagination((pagination) => ({ ...pagination, pageIndex })),
      [setPagination]
    );
    console.log("Passed 2");
    // ** Sorting config
    const [sortingColumns, setSortingColumns] = useState([]);
    const onSort = useCallback(
      (sortingColumns) => {
        setSortingColumns(sortingColumns);
      },
      [setSortingColumns]
    );
    console.log("Passed 3");
    // Column visibility
    const [visibleColumns, setVisibleColumns] = useState(() =>
      columns.map(({ id }) => id)
    ); // initialize to the full set of columns
    console.log("Passed 4");
    const renderCellValue = useMemo(() => {
      return ({ rowIndex, columnId, setCellProps }) => {
        const data = useContext(DataContext);
        useEffect(() => {
          if (columnId === "code_coverage") {
            if (data.hasOwnProperty(rowIndex)) {
              const realData = data[rowIndex][columnId].slice(0, -2);
              console.log(realData);

              let color;

              if (realData >= 75) {
                color = `rgba(0, 255, 0, 100)`;
              } else if (50 <= realData && realData < 75) {
                color = `rgba(255, 255, 0, 100)`;
              } else if (realData < 50) {
                color = `rgba(255, 0, 0, 100)`;
              }

              setCellProps({
                style: {
                  backgroundColor: color
                }
              });
            }
          }
        }, [rowIndex, columnId, setCellProps, data]);

        function getFormatted() {
          return data[rowIndex][columnId].formatted
            ? data[rowIndex][columnId].formatted
            : data[rowIndex][columnId];
        }

        return data.hasOwnProperty(rowIndex)
          ? getFormatted(rowIndex, columnId)
          : null;
      };
    }, []);
    console.log("Passed 5");

    console.log("RAW DATA FINAL: " + JSON.stringify(raw_data));

    return (
        <DataContext.Provider value={raw_data}>
          <EuiDataGrid
            aria-label="Quality Dasboard"
            columns={columns}
            columnVisibility={{ visibleColumns, setVisibleColumns }}
            rowCount={raw_data.length}
            renderCellValue={renderCellValue}
            inMemory={{ level: "sorting" }}
            sorting={{ columns: sortingColumns, onSort }}
            pagination={{
              ...pagination,
              pageSizeOptions: [10, 50, 100],
              onChangeItemsPerPage: onChangeItemsPerPage,
              onChangePage: onChangePage
            }}
            onColumnResize={(eventData) => {
              console.log(eventData);
            }}
          />
        </DataContext.Provider>
    );
  };

  return (
    <div>
      <GridViewDataTable />
    </div>
  );
}
