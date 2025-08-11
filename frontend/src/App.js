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
    console.log(response.data);
    return response.data.rows;
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return [];
  }
}

function App() {

  const [employees, setEmployees] = useState([]);
  const [columnDefs, setColumnDefs] = useState([ 
    { field: "id" },
    { field: "name" },
    { field: "salary" ,
      valueFormatter: p => "$" + p.value.toLocaleString()
    },
    { field: "department" }]);

  const loadData = async () => {
    const data = await getEmployeeData();
    setEmployees(data);
    console.log(data);
  };

  useEffect(() => {
    loadData();
  },[]);


  const defaultColDef = (useMemo(() => ({
    flex: 1,
    filter: true,
    floatingFilter: true,
  }), []));

  return (
    <div className="ag-theme-balham" style={{ height: 500}}>
      <AgGridReact 
        // rowData={rowData} 
        columnDefs={columnDefs}
        rowData={employees}
        // defaultColDef={defaultColDef}
        />

    </div>
  );
}
export default App;
