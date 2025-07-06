import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Progress,
  Button,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  TrophyIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/outline";
import {
  ClockIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { StatisticsChart } from "@/widgets/charts";
import api from "@/services/api";
import { toast } from "react-toastify";


function PaginationControls({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  
  let startPage, endPage;
  if (totalPages <= 5) {
    
    startPage = 1;
    endPage = totalPages;
  } else {
    // Mais de 5 páginas
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center gap-1 p-1 justify-center">
      <Button
        variant="text"
        className="flex items-center gap-1"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        color="gray"
        size="sm"
      >
        <ArrowLongLeftIcon strokeWidth={2} className="h-3 w-3" /> Anterior
      </Button>
      <div className="flex items-center gap-2">
        {/* Botão para a primeira página e ellipsis se necessário */}
        {startPage > 1 && (
          <>
            <IconButton variant="text" color="gray" onClick={() => onPageChange(1)}>1</IconButton>
            {startPage > 2 && <Typography className="text-gray-500">...</Typography>}
          </>
        )}
        {/* Botões das páginas visíveis */}
        {pageNumbers.map((number) => (
          <IconButton
            key={number}
            variant={currentPage === number ? "filled" : "text"}
            color="gray"
            onClick={() => onPageChange(number)}
            className="w-4 h-4"
          >
            {number}
          </IconButton>
        ))}
        {/* Botão para a última página e ellipsis se necessário */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <Typography className="text-gray-500">...</Typography>}
            <IconButton variant="text" color="gray" onClick={() => onPageChange(totalPages)}>{totalPages}</IconButton>
          </>
        )}
      </div>
      <Button
        variant="text"
        className="flex items-center gap-1"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        color="gray"
        size="sm"
      >
        Próximo <ArrowLongRightIcon strokeWidth={2} className="h-3 w-3" />
      </Button>
    </div>
  );
}


export function Home() {
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [teamRanking, setTeamRanking] = useState([]);
  const [tasksByStatusChartData, setTasksByStatusChartData] = useState({
    labels: [],
    data: [],
  });
  const [allMonthlyTasksData, setAllMonthlyTasksData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // --- Estados de Paginação para Atividades Recentes ---
  const [currentPageActivities, setCurrentPageActivities] = useState(1);
  const ITEMS_PER_PAGE_ACTIVITIES = 4; // Quantidade de atividades por página

  const taskStatusMap = {
    'a_fazer': 'A Fazer',
    'em_andamento': 'Em Andamento',
    'concluida': 'Concluída',
    'cancelada': 'Cancelada',
  };

  const allTaskStatusesKeys = Object.keys(taskStatusMap);

  const fetchDashboardSummary = async () => {
    try {
      const response = await api.get("/dashboard/summary/");
      setDashboardSummary(response.data);

      const statusDataFromBackend = response.data?.tasks_by_status || {};
      const chartLabels = [];
      const chartData = [];

      allTaskStatusesKeys.forEach(statusKey => {
        const displayedName = taskStatusMap[statusKey];
        const count = statusDataFromBackend[statusKey] || 0;

        chartLabels.push(displayedName);
        chartData.push(count);
      });

      setTasksByStatusChartData({
        labels: chartLabels,
        data: chartData,
      });

      let monthlyData = response.data?.monthly_tasks || [];
      monthlyData.sort((a, b) => new Date(a.mes) - new Date(b.mes));
      setAllMonthlyTasksData(monthlyData);

    } catch (error) {
      console.error("Erro ao carregar resumo do dashboard:", error.response ? error.response.data : error.message);
      toast.error("Erro ao carregar resumo do dashboard.");
    }
  };

  const fetchTeamRanking = async () => {
    try {
      const response = await api.get("/dashboard/teams/ranking/tasks_completed/");
      setTeamRanking(response.data);
    } catch (error) {
      console.error("Erro ao carregar ranking de equipes:", error.response ? error.response.data : error.message);
      toast.error("Erro ao carregar ranking de equipes.");
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Ajuste o endpoint se necessário. Se as atividades não vêm de /tasks, mude aqui.
      const tasksResponse = await api.get("/tasks/?limit=100&ordering=-completed_at"); // Busque mais atividades para paginação
      setRecentActivities(tasksResponse.data);
      setCurrentPageActivities(1); // Resetar para a primeira página ao buscar novas atividades
    } catch (error) {
      console.error("Erro ao carregar atividades recentes:", error.response ? error.response.data : error.message);
      toast.error("Erro ao carregar atividades recentes.");
    }
  };

  useEffect(() => {
    fetchDashboardSummary();
    fetchTeamRanking();
    fetchRecentActivities();
  }, []);

  const monthlyTasksChartData = useMemo(() => {
    if (allMonthlyTasksData.length === 0) {
      return { labels: [], data: [], total_tasks_completed_this_month: 0 };
    }

    const labels = allMonthlyTasksData.map(item => {
        const [year, month, day] = item.mes.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        return date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
    });

    const data = allMonthlyTasksData.map(item => item.count);

    const total_tasks_completed_this_month = allMonthlyTasksData.length > 0
        ? allMonthlyTasksData[allMonthlyTasksData.length - 1].count
        : 0;

    console.log("Monthly Chart Data preparado para ApexCharts (FINALMENTE):", { labels, data, total_tasks_completed_this_month });

    return { labels, data, total_tasks_completed_this_month };
  }, [allMonthlyTasksData]);

  const customStatisticsChartsData = [
    {
      color: "white",
      icon: <ClipboardDocumentCheckIcon className="w-8 h-8 text-white" />,
      title: "Tarefas por Status",
      value: dashboardSummary?.total_tasks !== undefined ? dashboardSummary.total_tasks.toLocaleString('pt-BR') : "N/A",
      description: "Distribuição atual das tarefas",
      chart: {
        type: "pie",
        height: 280,
        series: tasksByStatusChartData.data,
        options: {
          labels: tasksByStatusChartData.labels,
          colors: ["#42A5F5", "#66BB6A", "#FFA726", "#EF5350"],
          legend: {
            show: true,
            position: 'bottom',
            labels: { colors: "#424242" },
            fontFamily: 'Roboto, sans-serif',
            fontSize: '14px',
            markers: { radius: 6 },
            itemMargin: { horizontal: 20 },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              const label = opts.w.config.labels[opts.seriesIndex] || "N/A";
              if (val > 0) { return `${label}: ${val.toFixed(0)}%`; }
              return '';
            },
            style: { colors: ['#616161'], fontSize: '13px', fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' },
            dropShadow: { enabled: true, top: 1, left: 1, blur: 2, color: '#616161', opacity: 0.5 }
          },
          stroke: { show: true, width: 3, colors: ['#fff'] },
          plotOptions: {
            pie: {
              donut: {
                size: '60%',
                labels: {
                  show: true, name: { show: true, fontSize: '16px', fontFamily: 'Roboto, sans-serif', color: '#616161' },
                  value: { show: true, fontSize: '22px', fontFamily: 'Roboto, sans-serif', color: '#333', formatter: function (val) { return `${val}`; } },
                  total: { show: true, showAlways: true, label: 'Total', fontSize: '18px', fontFamily: 'Roboto, sans-serif', color: '#616161', formatter: function (w) { return w.globals.series.reduce((a, b) => a + b, 0); } }
                }
              },
              expandOnClick: false,
            }
          },
          tooltip: { fillSeriesColor: false, theme: 'dark', style: { fontSize: '14px', fontFamily: 'Roboto, sans-serif' } },
          responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
        },
      },
      footer: (
        <Typography variant="small" className="flex items-center font-normal text-blue-gray-600">
          <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400 mr-1" />
          {`Atualizado em ${new Date().toLocaleDateString('pt-BR')}`}
        </Typography>
      ),
    },
    {
      color: "white",
      icon: <ClockIcon className="w-8 h-8 text-white" />,
      title: "Tarefas Concluídas por Mês",
      value: monthlyTasksChartData.total_tasks_completed_this_month.toLocaleString('pt-BR'),
      description: "Desempenho de conclusão de tarefas nos últimos meses",
      chart: {
        type: "line",
        height: 220,
        series: [{ name: "Concluídas", data: monthlyTasksChartData.data }],
        options: {
          chart: { toolbar: { show: false }, zoom: { enabled: false } },
          colors: ["#009688"],
          stroke: { curve: 'smooth', width: 5, lineCap: 'round' },
          markers: { size: 6, colors: ['#009688'], strokeColors: '#fff', strokeWidth: 3, hover: { size: 8 } },
          xaxis: {
            categories: monthlyTasksChartData.labels,
            labels: { style: { colors: "#546E7A", fontSize: '13px', fontFamily: 'Roboto, sans-serif' } },
            axisBorder: { show: true, color: '#E0E0E0' },
            axisTicks: { show: true, color: '#BDBDBD' },
          },
          yaxis: {
            title: { text: 'Número de Tarefas', style: { color: "#546E7A", fontSize: '15px', fontWeight: 600, fontFamily: 'Roboto, sans-serif' } },
            labels: { style: { colors: "#546E7A", fontSize: '13px', fontFamily: 'Roboto, sans-serif' } },
            min: 0,
          },
          dataLabels: { enabled: false },
          tooltip: { x: { format: 'MMM yy' }, y: { formatter: function (val) { return `${val} tarefas`; } }, theme: 'dark', style: { fontSize: '14px', fontFamily: 'Roboto, sans-serif' } },
          grid: { show: true, borderColor: '#E0E0E0', strokeDashArray: 0, position: 'back', xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
        },
      },
      footer: (
        <Typography variant="small" className="flex items-center font-normal text-blue-gray-600">
          <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400 mr-1" />
          {`Dados dos últimos ${monthlyTasksChartData.labels.length} meses`}
        </Typography>
      ),
    },
  ];

  // --- Lógica de Paginação para Atividades Recentes ---
  const indexOfLastActivity = currentPageActivities * ITEMS_PER_PAGE_ACTIVITIES;
  const indexOfFirstActivity = indexOfLastActivity - ITEMS_PER_PAGE_ACTIVITIES;
  const currentActivities = recentActivities.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPagesActivities = Math.ceil(recentActivities.length / ITEMS_PER_PAGE_ACTIVITIES);

  const handlePageChangeActivities = useCallback((pageNumber) => {
    setCurrentPageActivities(pageNumber);
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
        {customStatisticsChartsData.map((props, index) => (
          <StatisticsChart
            key={props.title + index}
            {...props}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 shadow-xl border border-blue-gray-50/10 rounded-xl">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6 pb-4"
          >
            <div className="flex items-center justify-between">
                <div>
                    <Typography variant="h5" color="blue-gray" className="mb-1 font-bold">
                        Ranking de Equipes (Tarefas Concluídas)
                    </Typography>
                    <Typography
                        variant="small"
                        className="flex items-center gap-1 font-normal text-blue-gray-600"
                    >
                        <BuildingOfficeIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400 mr-1" />
                        Desempenho atual das equipes.
                    </Typography>
                </div>
                <Menu placement="left-start">
                    <MenuHandler>
                        <IconButton size="sm" variant="text" color="blue-gray">
                            <EllipsisVerticalIcon strokeWidth={3} className="h-6 w-6" />
                        </IconButton>
                    </MenuHandler>
                    <MenuList>
                        <MenuItem className="hover:bg-blue-gray-50 text-blue-gray-700">Ver todos os rankings</MenuItem>
                        <MenuItem className="hover:bg-blue-gray-50 text-blue-gray-700">Configurar período</MenuItem>
                    </MenuList>
                </Menu>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Equipe", "Tarefas Concluídas", "Progresso"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-100 py-3 px-6 text-left bg-blue-gray-50/50"
                      >
                        <Typography
                          variant="small"
                          className="text-xs font-semibold uppercase text-blue-gray-700"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {teamRanking.length > 0 ? (
                  teamRanking.map(
                    ({ team_name, tasks_completed }, key) => {
                      const className = `py-4 px-6 ${
                        key === teamRanking.length - 1
                          ? ""
                          : "border-b border-blue-gray-50/50"
                      }`;
                      const maxTasks = Math.max(...teamRanking.map(e => e.tasks_completed));
                      const completionPercentage = maxTasks > 0 ? (tasks_completed / maxTasks) * 100 : 0;

                      return (
                        <tr key={team_name || key} className="hover:bg-blue-gray-50/30 transition-colors">
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              {tasks_completed > 0 ? (
                                key === 0 ? (
                                  <TrophyIcon className="h-7 w-7 text-yellow-500" />
                                ) : key === 1 ? (
                                  <TrophyIcon className="h-7 w-7 text-gray-500" />
                                ) : key === 2 ? (
                                  <TrophyIcon className="h-7 w-7 text-amber-800" />
                                ) : (
                                  <BuildingOfficeIcon className="h-7 w-7 text-indigo-500" />
                                )
                              ) : (
                                <BuildingOfficeIcon className="h-7 w-7 text-indigo-500" />
                              )}
                              <Typography
                                variant="h6"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {team_name || "N/A"}
                              </Typography>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="lead"
                              className="text-base font-bold text-gray-800"
                            >
                              {tasks_completed || 0}
                            </Typography>
                          </td>
                          <td className={className}>
                            <div className="w-10/12">
                              <Typography
                                variant="small"
                                className="mb-1 block text-xs font-medium text-blue-gray-600"
                              >
                                {completionPercentage.toFixed(0)}%
                              </Typography>
                              <Progress
                                value={completionPercentage}
                                variant="gradient"
                                color={completionPercentage === 100 ? "green" : "blue"}
                                className="h-2 rounded-full"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td colSpan={3} className="py-5 px-5 text-center">
                      <Typography className="text-sm font-normal text-blue-gray-500">
                        Nenhuma equipe encontrada no ranking.
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card className="shadow-xl border border-blue-gray-50/10 rounded-xl">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6 pb-4"
          >
            <Typography variant="h5" color="blue-gray" className="mb-2 font-bold">
              Atividades Recentes
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400 mr-1" />
              Últimas atualizações do sistema.
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {recentActivities.length === 0 ? (
              <Typography className="text-sm font-normal text-blue-gray-500 py-5 text-center">
                Nenhuma atividade recente encontrada.
              </Typography>
            ) : (
              <> {/* Fragment para agrupar a lista e os controles de paginação */}
                {currentActivities.map( // Agora mapeia `currentActivities`
                  ({ id, description, status, team, completed_at }, key) => (
                    <div key={id} className="flex items-start gap-4 py-3 border-b border-blue-gray-50/50 last:border-b-0">
                      <div
                        className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-100 after:content-[''] ${
                          key === currentActivities.length - 1 // A linha só vai até o último item da PÁGINA atual
                            ? "after:h-0"
                            : "after:h-4/6"
                        }`}
                      >
                        {status === 'concluida' ? (
                          <CheckCircleIcon className="!w-6 !h-6 text-green-500" />
                        ) : status === 'cancelada' ? (
                          <span className="!w-6 !h-6 text-red-500 text-xl font-bold flex items-center justify-center">X</span>
                        ) : status === 'a_fazer' ? (
                          <ClockIcon className="!w-6 !h-6 text-orange-500" />
                        ) : (
                          <ClipboardDocumentCheckIcon className="!w-6 !h-6 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="block font-semibold"
                        >
                          {description || `Tarefa ${id}`}
                          <span className="ml-2 font-normal text-gray-700 text-sm">
                             {status === 'concluida' ? 'concluída' : status.replace(/_/g, ' ')}
                          </span>
                        </Typography>
                        <Typography
                          as="span"
                          variant="small"
                          className="text-xs font-medium text-blue-gray-500 mt-0.5"
                        >
                          {team ? `Equipe: ${team.name || team}` : ''} - {completed_at ? new Date(completed_at).toLocaleString('pt-BR') : 'Data Indefinida'}
                        </Typography>
                      </div>
                    </div>
                  )
                )}
                {/* Controles de Paginação para Atividades Recentes */}
                {totalPagesActivities > 1 && (
                    <PaginationControls
                        currentPage={currentPageActivities}
                        totalPages={totalPagesActivities}
                        onPageChange={handlePageChangeActivities}
                    />
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
