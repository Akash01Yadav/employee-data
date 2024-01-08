import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

import './employee-data.css';
import { alphabetsWithSpacesPattern, digitAllow, numberValidation } from './lib/constant';

Modal.setAppElement('#root');

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    id: Date.now(),
    dob: '',
    salary: '',
    joiningDate: '',
    relievingDate: '',
    contact: '',
    status: 'active',
  });
  const [editEmployee, setEditEmployee] = useState({});
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/employees')
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    if (name === 'name' && value && !alphabetsWithSpacesPattern.test(value)) {
      return;
    }
    if (name === 'salary' && value && !digitAllow.test(value)) {
      return;
    }
    if (name === 'contact' && !numberValidation.test(value)) {
      return;
    }
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name' && value && !alphabetsWithSpacesPattern.test(value)) {
      return;
    }
    if (name === 'salary' && value && !digitAllow.test(value)) {
      return;
    }
    if (name === 'contact' && !numberValidation.test(value)) {
      return;
    }
    setEditEmployee({ ...editEmployee, [name]: value });
  };

  const handleAddEmployee = () => {
    if (newEmployee.name) {
      axios.post('http://localhost:5000/api/employees', newEmployee)
        .then(response => {
          setEmployees([...employees, response.data]);
          setNewEmployee({
            name: '',
            id: Date.now(),
            dob: '',
            salary: '',
            joiningDate: '',
            relievingDate: '',
            contact: '',
            status: 'active',
          });
          setAddModalOpen(false);
        })
        .catch(error => console.error('Error adding employee', error));
    } else {
      alert('Enter name please')
    }
  };

  const handleEditEmployee = () => {
    axios.put(`http://localhost:5000/api/employees/${editEmployee.id}`, editEmployee)
      .then(() => {
        const updatedEmployees = employees.map(emp => (emp.id === editEmployee.id ? editEmployee : emp));
        setEmployees(updatedEmployees);
        setEditEmployee({});
        setEditModalOpen(false);
      })
      .catch(error => console.error('Error editing employee', error));
  };

  const handleDeleteEmployee = (id) => (e) => {
    axios.delete(`http://localhost:5000/api/employees/${id}`)
      .then(() => {
        const updatedEmployees = employees.filter(emp => emp.id !== id);
        setEmployees(updatedEmployees);
      })
      .catch(error => console.error('Error deleting employee', error));
    e.stopPropagation();
  };

  return (
    <div>
      <h1>Employee Management</h1>
      <button onClick={() => setAddModalOpen(true)}>Add Employee</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Salary</th>
            <th>Joining Date</th>
            <th>Relieving Date</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id} onClick={() => { setEditEmployee(employee); setEditModalOpen(true); }}>
              <td>{employee.name}</td>
              <td>{employee.dob}</td>
              <td>{employee.salary}</td>
              <td>{employee.joiningDate}</td>
              <td>{employee.relievingDate}</td>
              <td>{employee.contact}</td>
              <td>{employee.status}</td>
              <td>
                <button onClick={handleDeleteEmployee(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isAddModalOpen} onRequestClose={() => setAddModalOpen(false)}>
        <h2>Add Employee</h2>
        <div>
          <form>
            <label>Name:</label>
            <input type="text" name="name" value={newEmployee.name} onChange={handleInputChange} />

            <label>DOB:</label>
            <input type="date" name="dob" value={newEmployee.dob} onChange={handleInputChange} />

            <label>Salary:</label>
            <input type="text" name="salary" value={newEmployee.salary} onChange={handleInputChange} />

            <label>Joining Date:</label>
            <input type="date" name="joiningDate" value={newEmployee.joiningDate} onChange={handleInputChange} />

            <label>Relieving Date:</label>
            <input type="date" name="relievingDate" value={newEmployee.relievingDate} onChange={handleInputChange} />

            <label>Contact:</label>
            <input type="text" name="contact" value={newEmployee.contact} onChange={handleInputChange} />

            <label>Status:</label>
            <select name="status" onChange={handleInputChange}>
              <option value="Active">Active</option>
              <option value="InActive">In Active</option>
            </select>
          </form>
          <button onClick={handleAddEmployee}>Add Employee</button>
          <button onClick={() => setAddModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
      <Modal isOpen={isEditModalOpen} onRequestClose={() => setEditModalOpen(false)}>
        <h2>Edit Employee</h2>
        <div>
          <form>
            <label>Name:</label>
            <input type="text" name="name" value={editEmployee.name} onChange={handleEditChange} />

            <label>DOB:</label>
            <input type="date" name="dob" value={editEmployee.dob} onChange={handleEditChange} />

            <label>Salary:</label>
            <input type="text" name="salary" value={editEmployee.salary} onChange={handleEditChange} />

            <label>Joining Date:</label>
            <input type="date" name="joiningDate" value={editEmployee.joiningDate} onChange={handleEditChange} />

            <label>Relieving Date:</label>
            <input type="date" name="relievingDate" value={editEmployee.relievingDate} onChange={handleEditChange} />

            <label>Contact:</label>
            <input type="text" name="contact" value={editEmployee.contact} onChange={handleEditChange} />

            <label>Status:</label>
            <select name="status" onChange={handleEditChange}>
              <option value="Active">Active</option>
              <option value="InActive">In Active</option>
            </select>
          </form>
          <button onClick={handleEditEmployee}>Save Changes</button>
          <button onClick={() => setEditModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
