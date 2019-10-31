import React from 'react';
import './App.css';
import axios from 'axios';
import CRUD from 'react-simple-crud';
import {BrowserRouter as Router, Route} from 'react-router-dom';

function App() {
  const apiURL = 'https://www.api.com/test';
  const actions = {
    create: data => new Promise((resolve, reject) => axios.post(apiURL, data).then(result => resolve(result.data))),
    read: id => new Promise((resolve, reject) => axios.get(apiURL + '/' + id).then(result => resolve(result.data.data))),
    readAll: () => new Promise((resolve, reject) => axios.get(apiURL).then(result => resolve(result.data.data))),
    update: (id, data) =>
      new Promise((resolve, reject) => axios.put(apiURL + '/' + id, data).then(result => resolve(result.data))),
    delete: id => new Promise((resolve, reject) => axios.delete(apiURL + '/' + id).then(result => resolve(result.data))),
  };

  const format = {
    live: {name: 'Live', type: 'checkbox', default: false},
    name: {name: 'Name', type: 'text', default: 'my name'},
    description: {name: 'Description', type: 'textarea', default: ''},
    birth_year: {name: 'Birth year', type: 'text', default: ''},
  };

  return (
    <Router>
      <div className="App">
        <Route exact path="/test">
          <CRUD path={'/test'} actions={actions} format={format} />
        </Route>
      </div>
    </Router>
  );
}

export default App;
