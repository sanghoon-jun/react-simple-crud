import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import List from './List';
import Editor from './Editor';
import './style.css';

class CRUD extends React.Component {
  render() {
    const {path, actions, format} = this.props;
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
          <List actions={actions} format={format} path={path} />
        </Route>
        <Route path={path + '/:id'}>
          <Editor actions={actions} format={format} path={path} />
        </Route>
      </Router>
    );
  }
}

export default CRUD;
