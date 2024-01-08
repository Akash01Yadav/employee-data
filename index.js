const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// Replace this with your actual employee data storage
let employees = [];

app.get('/api/employees', (req, res) => {
  res.json(employees);
});

app.post('/api/employees', (req, res) => {
    console.log('execute 1');
  const newEmployee = { ...req.body };
  employees.push(newEmployee);
  res.json(newEmployee);
});

app.put('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedEmployee = { ...req.body, id };
  employees = employees.map(emp => (emp.id === id ? updatedEmployee : emp));
  res.json(updatedEmployee);
});

app.delete('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  employees = employees.filter(emp => emp.id !== id);
  res.json({ message: 'Employee deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
