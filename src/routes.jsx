import {
  TableCellsIcon,
  ClipboardDocumentCheckIcon,
  HomeModernIcon,
  MapPinIcon,
  TruckIcon,
  ArrowLeftEndOnRectangleIcon,
  Cog6ToothIcon,
  ChartPieIcon

} from "@heroicons/react/24/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { Home, Tables } from "@/pages/dashboard";
import Kanban from "@/pages/kanban/Kanban";
import MeasurementForm from "./components/measurement/MeasurementForm";
import WorksPage from "./pages/works/WorksPage";
import AddressesPage from "./pages/addresses/AddressesPage";
import VehiclesPages from "./pages/vehicles/VehiclesPages";
import Logout from "./pages/auth/logout";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <ChartPieIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },

      {
        icon: <TableCellsIcon {...icon} />,
        name: "Tabelas",
        path: "/tables",
        element: <Tables />,
      },

      {
        icon: <HomeModernIcon {...icon} />,
        name: "Add Obra",
        path: "/work",
        element: <WorksPage />,
      },

      {
        icon: < MapPinIcon {...icon} />,
        name: "Add Endereço",
        path: "/addresses",
        element: <AddressesPage />,
      },

      {
        icon: < TruckIcon {...icon} />,
        name: "Veículos",
        path: "/vehicles",
        element: <VehiclesPages />,  
      },
    ],
  },
  {
    layout: "dashboard",
    title: "Tarefas",
    pages: [
      {
        icon: <  ClipboardDocumentCheckIcon
          {...icon} />,
        name: "Add Tarefas",
        path: "/kanban",
        element: <Kanban />,
      },
      {
        icon: <  AdjustmentsHorizontalIcon
          {...icon} />,
        name: "Medidas",
        path: "/measurement",
        element: <MeasurementForm />,
      },
    ]
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Administração",
        path: "http://localhost:8000/admin",
        external: true,
      },
      {
        icon: <ArrowLeftEndOnRectangleIcon {...icon} />,
        name: "Sair",
        path: "/logout",
        element: <Logout />,
      },
      
    ],
  },
];

export default routes;
