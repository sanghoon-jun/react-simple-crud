import React from 'react';
import {withRouter} from 'react-router-dom';

const Field = props => {
  const {name, children} = props;
  return (
    <tr className="crud-field">
      <td className="crud-editor-table-field crud-editor-table-field-header">{name}</td>
      <td className="crud-editor-table-field crud-editor-table-field-input">{children}</td>
    </tr>
  );
};

const Input = props => {
  const {type, value, options, onChange} = props;
  if (type === 'textarea')
    return (
      <textarea value={value || ''} className="crud-input crud-textarea" rows={5} onChange={e => onChange(e.target.value)} />
    );
  else if (type === 'checkbox')
    return <input type="checkbox" checked={value === true} onChange={e => console.log(e.target.checked)} />;
  else if (type === 'select')
    return (
      <select className="crud-input" value={value} onChange={e => onChange(e.target.value)}>
        {(options || []).map(option => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    );
  else return <input value={value || ''} className="crud-input" onChange={e => onChange(e.target.value)} />;
};

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      is_loading: false,
    };
  }

  componentDidMount() {
    const {match, actions, format} = this.props;
    const id = match.params.id;
    if (id) {
      if (id === 'new') {
        // new
        let data = {};
        Object.keys(format).map(k => {
          if (format[k].hasOwnProperty('default')) data[k] = format[k].default;
        });
        this.setState({data});
        // TODO: default values
      } else {
        // edit
        actions['read'](id).then(result => {
          this.setState({data: result});
        });
      }
    }
  }

  moveToList() {
    const {history, path} = this.props;
    history.push(path + '/');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  submit(id, v) {
    const {actions, beforeSubmit} = this.props;
    let data = {...v};
    delete data.id;
    delete data.created_at;
    delete data.updated_at;
    if (beforeSubmit) data = beforeSubmit(data);
    if (id === 'new') actions['create'](data).then(() => this.moveToList());
    else actions['update'](id, data).then(() => this.moveToList());
  }

  delete(id) {
    const {actions} = this.props;
    if (actions['delete']) actions['delete'](id).then(() => this.moveToList());
  }

  render() {
    const {format, match} = this.props;
    const {data} = this.state;
    const id = match.params.id;
    return (
      <div className="crud-editor">
        <table className="crud-editor-table">
          <tbody>
            {Object.keys(format).map(key => (
              <Field name={format[key].name || key} key={key}>
                <Input
                  type={format[key].type}
                  value={data[key]}
                  options={format[key].options}
                  onChange={v => this.setState({data: {...this.state.data, [key]: v}})}
                />
              </Field>
            ))}
            <tr>
              <td className="crud-editor-buttons-left">
                {id !== 'new' ? (
                  <button className="crud-button" onClick={() => this.delete(id)}>
                    DELETE
                  </button>
                ) : (
                  ''
                )}
              </td>
              <td className="crud-editor-buttons-right">
                <button className="crud-button" onClick={() => this.submit(id, this.state.data)}>
                  SUBMIT
                </button>
                <button className="crud-button" onClick={() => this.moveToList()}>
                  CANCEL
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(Editor);
