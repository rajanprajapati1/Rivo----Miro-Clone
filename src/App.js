import { Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
// import { getAppTheme } from "./theme/theme";
// import GoogleDriveUI from "./components/GoogleDrive";
// import CRMDashboard from "./components/Ui";
// import Test from "./Test";
// import SmoothScrollScene from "./components/GsapTest";
// import ExampleChart from "./components/Chart";
// import Dragging from "./components/Dragging";
// import PremiumTable from "./components/Email";
// import VirtualizedTable from "./components/Virutal";
// import Dashboard from "./dashboard/dashboard/Dashboard";
// import Calendar from "./Calendar/index";
// import Invoice from "./invoice";
// import InvoiceBuilder from "./invoice/InvoiceBuilder";
// import KanbanPipeline from "./components/Kanban";
// import DealsPipeline from "./components/kanban.utils/DealsPipeline";
// import SalesPipeline from "./components/kanban.utils/SalesPipeline";
// import MarketingPipeline from "./components/kanban.utils/MarketingPipeline";
// import HeaderClone from "./components/headers";
// import ProductionTable from "./Grid";
// import TabManage from "./tab";
// import VoiceAIAnimation from "./Mic";
// import DesignsTable from "./designsection ltest grid";
// import Test from "./test1";
// import Account from './account'
// import ComplexStepperForm from "./auto/bakup";
// import PremiumRightsMatrix from "./Rights";
// import Excel from './spreadsheet'
// import { SpreadsheetEditor } from 'grid-sheet-react';
// import InterviewDashboard from "./test1";

import Edtor from "./editor";

const App = () => {
  const theme = createTheme({
    typography: {
      fontFamily: "Poppins , sans-serif !important",
    },
    palette: {
      mode: "light",
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            path="/"
            element={
              <div
                style={{
                  fontFamily: "Poppins , sans-serif !important",
                }}
              >
                <Edtor />
              </div>
            }
          />
        </Routes>
      </ThemeProvider>
    </>
  );
};

export default App;
