import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newField, setNewField] = useState('');
  const [newFieldType, setNewFieldType] = useState('String'); // Default to String
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(''); // For age
  const [newEmail, setNewEmail] = useState(''); // For email

  // Fetch users from the server
  const fetchUsers = () => {
    axios
      .get('http://localhost:3001/getUsers')
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle adding a new field to users
  const handleAddField = () => {
    if (newField.trim() === '') {
      alert('Please enter a valid field name');
      return;
    }

    console.log({ fieldName: newField, fieldType: newFieldType }); // Debugging: Check data before sending

    axios
      .post('http://localhost:3001/add-field', {
        fieldName: newField,
        fieldType: newFieldType,
      })
      .then((response) => {
        console.log('Field added response:', response.data); // Log the response
        fetchUsers(); // Fetch updated users
        setNewField(''); // Clear the input after adding the field
      })
      .catch((err) => console.log(err));
  };

  const addUser = async () => {
    try {
      const response = await axios.post('http://localhost:3001/add-user', {
        name: newName,
        age: newAge,
        email: newEmail
      });
      console.log('User added response:', response.data); // Log the response
      fetchUsers(); // Fetch updated users
      setNewName(''); // Clear the inputs after adding the user
      setNewAge(''); 
      setNewEmail('');
    }
    catch (error) {
      console.error(error);
    }
  };

  // Extract unique field names from all users
  const getAllFieldNames = () => {
    const fieldNames = new Set();
    users.forEach(user => {
      Object.keys(user).forEach(field => fieldNames.add(field));
    });
    return Array.from(fieldNames); // Convert Set to Array
  };

  const fieldNames = getAllFieldNames(); // Get field names dynamically from users

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2 className="mb-4">User Management</h2>
          <div className="mb-1">
            
          <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Enter age"
              value={newAge}
              onChange={(e) => setNewAge(e.target.value)}
            />
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            
            </div>
          <div className="mb-3">
            
            <input
              type="text"
              className="form-control"
              placeholder="Enter new field name"
              value={newField}
              onChange={(e) => setNewField(e.target.value)}
            />
            <select
              className="form-select mt-2"
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
            >
              <option value="String">String</option>
              <option value="Number">Number</option>
              <option value="Boolean">Boolean</option>
            </select>
          </div>
          <button className="btn btn-primary mb-3" onClick={handleAddField}>
            Add Field
          </button>
          <button className="btn btn-secondary mb-3" onClick={addUser}>
            Add User
          </button>

          <table className="table table-striped">
            <thead>
              <tr>
                {fieldNames.map((fieldName) => (
                  <th key={fieldName}>{fieldName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  {fieldNames.map((fieldName) => (
                    <td key={fieldName}>
                      {user[fieldName] !== undefined ? user[fieldName].toString() : 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
