# react-simple-crud

# Installation

yarn add react-simple-crud

# Usage
import CRUD from 'react-simple-crud';

# Example

```javascript
import CRUD from 'react-simple-crud';

const MyCRUD = (props) => {
  const actions = {
      create: data =>
        new Promise(resolve => axios.post("http://xxxxx.com", data).then(() => resolve())),
      read: id =>
        new Promise(resolve => axios.get("http://xxxxx.com/" + id).then(result => resolve(result.data))),
      readAll: () =>
        new Promise(resolve => axios.get("http://xxxxx.com").then(result => resolve(result.data))),
      update: (id, data) =>
        new Promise(resolve => axios.put("http://xxxxx.com" + id, data).then(() => resolve())),
      delete: id => 
        new Promise(resolve => axios.delete("http://xxxxx.com" + id).then(() => resolve())),
    };
    
  const format = {
    live: {name: 'Live', type: 'checkbox', default: false},
    name: {name: 'Name', type: 'text', default: 'my name'},
    description: {name: 'Description', type: 'textarea', default: ''},
    birth_year: {name: 'Birth year', type: 'text', default: ''},
  };

  return 
  <CRUD path={'/mycrud'} actions={actions} format={format} />
  
}
export default MyCRUD

```
