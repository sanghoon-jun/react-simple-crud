import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {Link, withRouter} from 'react-router-dom';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    if (this.props && this.props.actions && this.props.actions['readAll']) {
      this.props.actions['readAll']()
        .then(result => {
          this.setState({data: result});
        })
        .catch(error => console.log(error));
    }
  }

  render() {
    const {format, history, path, primaryKey} = this.props;
    const {data} = this.state;

    // columns
    let columns = [];
    for (const key in format) {
      if (!format[key].hasOwnProperty('list') || format[key].list) {
        let column = {};
        column['id'] = key;
        column['Header'] = format[key].name || key;
        if (format[key].list) column['accessor'] = format[key].list;
        else {
          switch (format[key].type) {
            case 'textarea':
              column['accessor'] = key;
              break;
            case 'checkbox':
              column['accessor'] = d => (d[key] ? 'o' : 'x');
              break;
            case 'list':
              column['accessor'] = d => (d[key] ? d[key].length : 0);
              break;
            default:
              column['accessor'] = key;
              break;
          }
        }
        columns.push(column);
      }
    }

    return (
      <div className="crud-list">
        <ReactTable
          columns={columns}
          data={this.state.data}
          getTrProps={(state, rowInfo) => ({
            onClick: () => history.push(path + '/' + rowInfo.original[primaryKey]),
          })}
        />
      </div>
    );
  }
}

export default withRouter(List);
