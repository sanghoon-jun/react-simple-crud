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
  else if (type === 'text' || type === 'int' || type === 'float')
    return <input value={value || ''} className="crud-input" onChange={e => onChange(e.target.value)} />;
  else if (type) {
    const CustomInput = type;
    return <CustomInput value={value} onChange={v => onChange(v)} />;
  } else return '';
};

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _is_loading: false,
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
          if (!format[k].readOnly) {
            if (format[k].hasOwnProperty('default')) data[k] = format[k].default;
          }
        });
        this.setState(data);
      } else {
        // edit
        actions['read'](id).then(result => {
          let data = {};
          Object.keys(format).map(k => (!format[k].readOnly ? (data[k] = result[k]) : null));
          this.setState(data);
        });
      }
    }
  }

  moveToList() {
    const {history, path} = this.props;
    history.push(path + '/');
  }

  submit(id, v) {
    const {actions, beforeSubmit, format} = this.props;
    let data = {...v};
    delete data.id; // TODO -> readonly
    delete data._is_loading;
    Object.keys(format).map(k => {
      if (data[k] && format[k].type === 'int') data[k] = parseInt(data[k]);
      if (data[k] && format[k].type === 'float') data[k] = parseFloat(data[k]);
    });
    console.log(data);
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
    const id = match.params.id;
    return (
      <div className="crud-editor">
        <table className="crud-editor-table">
          <tbody>
            {Object.keys(format).map(key =>
              !format[key].readOnly ? (
                <Field name={format[key].name || key} key={key}>
                  <Input
                    type={format[key].type}
                    value={this.state[key]}
                    options={format[key].options}
                    onChange={v => this.setState({[key]: v})}
                  />
                </Field>
              ) : (
                ''
              ),
            )}
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
                <button className="crud-button" onClick={() => this.submit(id, this.state)}>
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
