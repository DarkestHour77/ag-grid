import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme
import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);


const getEmployeeData = async () => {
  try{
    const response = await axios.get('http://localhost:8000/data')
    return response.data.rows;
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return [];
  }
}

function App() {

  const [employees, setEmployees] = useState([]);

  const loadData = async () => {
    const data = await getEmployeeData();
    setEmployees(data);
  };

  useEffect(() => {
    loadData();
  },[]);

  

  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ]);

  const [columnDefs, setColumnDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" ,
      valueFormatter: p => "$" + p.value.toLocaleString()
    },
    { field: "electric" }
  ]);

  const defaultColDef = (useMemo(() => ({
    flex: 1,
    filter: true,
    floatingFilter: true,
  }), []));

  return (
    <div className="ag-theme-balham" style={{ height: 500}}>
      <AgGridReact 
        rowData={rowData} 
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        />

    </div>
  );
}
export default App;
