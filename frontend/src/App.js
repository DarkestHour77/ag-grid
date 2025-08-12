import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css'; 
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

const postEmployeeData = async (name, salary, department) => {
  try{
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

const deleteEmployeeData = async (id) =>{
  try{
    const response = await axios.delete(`http://localhost:8000/data/${id}`)
    return response.data
  }catch(error){
    console.error("Error deleting data",error)
  }
}

const updateEmployeeData = async (id, name, salary, department) => {
  try{
    const response = await axios.put(`http://localhost:8000/data/${id}`, {
      name,
      salary,
      department,
    })
    return response.data;
  }catch(error){
    console.error("Error updating employee data:", error);  }
}



function App() {

  const gridRowsRef = useRef([])
  const gridRef = useRef(null);

  const [ , forceUpdate] = useState(0);
  
  const [columnDefs, setColumnDefs] = useState([ 
   
    { field: "name",editable: true },
    { field: "salary", editable: true},
    { field: "department", editable: true},
    { headerName: "Actions",
      cellRenderer: (params ) => (
      <div className='ag-grid-btn'>  
        <button className='edit-btn' onClick={()=>handleUpdateData(params.data)}>Update</button>
        <button className='delete-btn' onClick={()=>handleDeleteData(params.data.id)}>Delete</button>
      </div>
    )},
    
  ]);
  const [formData,setFormData] = useState({
    name:"",
    salary:"",
    department:"",
  })

  
  const defaultColDef = (useMemo(() => ({
    flex: 1,
    filter: true,
    floatingFilter: true,
    
  }), []));
  const defaultRowDef = (useMemo(() => ({
    rowHeight: 100
    
  }), []));
  
  const loadData = async () => {
    const data = await getEmployeeData();
    gridRowsRef.current = data; 
    forceUpdate( n => n+1)
    // gridRef.current.api.sizeColumnsToFit(); // Adjust columns to fit the grid width
  };  
    
  const handleInputChange = (e) =>{
    const{name,value}= e.target;
    setFormData(prevData=>({...prevData, [name]:value}))
  }
  
  const handleEmployeesData = async(e) =>{
    e.preventDefault()
    try{
      const newEmployees = await postEmployeeData(formData.name,formData.salary,formData.department)
      
      gridRowsRef.current.push(newEmployees)  //push appended data to the existing array
      loadData()
      setFormData({
        name:"",
        salary:"",
        department:"",
      })
    }catch(error){
      console.error("Error adding EmployeeData",error)
    }
  }
  
  const handleDeleteData = async(id) =>{
    try{
      await deleteEmployeeData(id)
      gridRowsRef.current = gridRowsRef.current.filter(data => data.id !== id)
      forceUpdate(n => n+1)
    }catch(error){
      console.error("Error deleting EmployeeData",error)
    }
  }
  
  
  const handleUpdateData = async(data) =>{
      try{
        await updateEmployeeData(data.id, data.name, data.salary, data.department);
      }catch (error) {
        console.error('Error updating employee data:', error);
      }
      loadData();
  }  
    useEffect(() => {
      loadData();
    },[]);
  
  
  
  
  
  return (
    <div className="App">
      <div className='addform'>
        
        <h2>Add Employee</h2>
        <form>
          <input type="text" name="name" placeholder="Name" required value={formData.name} onChange={handleInputChange}/>
          <input type="number" name="salary" placeholder="Salary" required value={formData.salary} onChange={handleInputChange}/>
          <input type="text" name="department" placeholder="Department" required value={formData.department} onChange={handleInputChange}/>
          <button className='formsubmit' type="submit" onClick={handleEmployeesData} >Add Employee</button>
        </form>


      </div>

      <div className="ag-theme-balham" >
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={gridRowsRef.current} 
          
          defaultColDef={defaultColDef}
          // rowSelection={'multiple'}
          // onSelectionChanged={onSelectionChanged}
          />
      </div>
    </div>
  );
}
export default App;
