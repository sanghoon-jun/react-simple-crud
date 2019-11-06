import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import List from './List';
import Editor from './Editor';
import './style.css';
import axios from 'axios';
import moment from 'moment';

class CRUD extends React.Component {
  render() {
    const {path, actions, format, primaryKey} = this.props;
    return (
      <Router>
        <div className="crud-toolbar">
          <div className="crud-toolbar-left">
            <Link to={path} className="crud-button">
              List
            </Link>
          </div>
          <div className="crud-toolbar-right">
            <Link to={path + '/new'} className="crud-button">
              Add
            </Link>
          </div>
        </div>
        <Route exact path={path + '/'}>
          <List actions={actions} format={format} path={path} primaryKey={primaryKey || '_id'} />
        </Route>
        <Route path={path + '/:id'}>
          <Editor actions={actions} format={format} path={path} />
        </Route>
      </Router>
    );
  }
}

export default CRUD;

export const actionFactory = apiURL => ({
  create: data =>
    new Promise((resolve, reject) =>
      axios
        .post(apiURL, data)
        .then(result => resolve(result.data))
        .catch(error => reject(error)),
    ),
  read: id =>
    new Promise((resolve, reject) =>
      axios
        .get(apiURL + '/' + id)
        .then(result => resolve(result.data))
        .catch(error => reject(error)),
    ),
  readAll: () =>
    new Promise((resolve, reject) =>
      axios
        .get(apiURL)
        .then(result => resolve(result.data))
        .catch(error => reject(error)),
    ),
  update: (id, data) =>
    new Promise((resolve, reject) =>
      axios
        .put(apiURL + '/' + id, data)
        .then(result => resolve(result.data))
        .catch(error => reject(error)),
    ),
  delete: id =>
    new Promise((resolve, reject) =>
      axios
        .delete(apiURL + '/' + id)
        .then(result => resolve(result.data))
        .catch(error => reject(error)),
    ),
});

export const parseTime = ts => {
  return moment(ts).format('MM-DD HH:mm');
};
