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
    // console.log(response.data);s
    return response.data.rows;
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return [];
  }
}

const postEmployeeData = async (name, salary, department) => {
  try{
    console.log(name,salary,department)
    const response = await axios.post('http://localhost:8000/data', {
      name,
      salary,
      department,
    })
    return response.data
  }catch (error) {
    console.error('Error posting employee data:', error);
    return null;
  }
} 

function App() {
  const [employees, setEmployees] = useState([]);
  const [columnDefs, setColumnDefs] = useState([ 
    { field: "id" },
    { field: "name" },
    { field: "salary"},
    { field: "department" }]
  );
  const [formData,setFormData] = useState({
    name:"",
    salary:"",
    department:"",
  })


  const loadData = async () => {
    const data = await getEmployeeData();
    setEmployees(data);
  };

  useEffect(() => {
    loadData();
  },[]);


  const defaultColDef = (useMemo(() => ({
    flex: 1,
    filter: true,
    floatingFilter: true,
  }), []));

  const handleInputChange = (e) =>{
    const{name,value}= e.target;
    setFormData(prevData=>({...prevData, [name]:value}))
  }

  const handleEmployeesData = async(e) =>{
    e.preventDefault()
    try{
      const newEmployees = await postEmployeeData(formData.name,formData.salary,formData.department)
      
      setEmployees([...employees, newEmployees])
      loadData();
      setFormData({
        name:"",
        salary:"",
        department:"",
      })
    }catch(error){
      console.error("Error adding EmployeeData",error)
    }
  }

  return (
    <div className="App">
      <div className='addform'>
        
        <h2>Add Employee</h2>
        <form>
          <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleInputChange}/>
          <input type="number" name="salary" placeholder="Salary" required value={formData.salary} onChange={handleInputChange}/>
          <input type="text" name="department" placeholder="Department" required value={formData.department} onChange={handleInputChange}/>
          <button type="submit" onClick={handleEmployeesData} >Add Employee</button>
        </form>


      </div>

      <div className="ag-theme-balham" style={{ height: 500}}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={employees}
          defaultColDef={defaultColDef}
          />
      </div>
    </div>
  );
}
export default App;
