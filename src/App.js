import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    // When you pass props to super, the props get assigned to 'this'
    super(props);
    // this.state is the buildiing block of the data that gets used
    this.state = {
      newItem: '',
      list: []
    }
  }

  // component mounted means when component is injected into DOM tree
  componentDidMount() {
    //incorporating local storage so data survives a full browser restart
    // note: session storage saved data survives just a page refresh
    this.hydrateStateWithLocalStorage();
    // add event listener to save state to localStorage
    // when user leaves/refreshes the page 
    window.addEventListener(
      // "beforeunload" means before leaving the current page
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  }

  // unmount is a function called immediately before the component is ended/destroyed 
  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
    // saves data to local storage if component successfully unmounts
    this.saveStateToLocalStorage();
  }

  hydrateStateWithLocalStorage() {
    // for loop through all items in state
    for (let key in this.state) {
      // if 'key' (our random id number) exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string (data saved) and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  saveStateToLocalStorage() {
    // for loop through every item in React state to rewrite our list
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  updateInput(key, value) {
    // update react state with input data,
    // the key = random unique id and also string added from input
    this.setState({
      [key]: value
    })
  }

  addItem() {
    // create item with unique id using math random
    const newItem = {
      id: 1 + Math.random(),
      value: this.state.newItem
    };
    // console log shows us the random number out of curiosity
    console.log(newItem.id);

    // copy of current item list
    const list = [...this.state.list];

    // add new item to list 
    list.push(newItem);

    // update state with new list then
    //  reset newItem input after last 'newItem' has been processed
    this.setState({
      list,
      newItem: ''
    })
  }

  // id of line selected is passed through as parameter into function
  deleteItem(id) {
    // copy up to date list of items into function scope 
    const list = [...this.state.list];
    // to 'filter' out item to delete, i.e. new variable stores all 
    // items that do not match selected id to erase 
    const updatedList = list.filter(item => item.id !== id);
    // to set state of list with updated list 
    this.setState({ list: updatedList });
  }

  // We render and return what we want to show on the view screen 
  render() {
    return (
      <div className="App">
        <div>
          <h3>Add tasks that still need to be done...</h3>
          <div className='inputAndBtn'>
            <input className='form-control'
              type='text'
              placeholder='Input item here'
              value={this.state.newItem}
              // Value being typed goes into newItem via updateInput function 
              onChange={e => this.updateInput('newItem', e.target.value)}
              style={{width: '70%', height: '52px'}}
            />
            {/* addItem function creates the newItem, pushes it into list array */}
            {/* There is no POST of this data because of technique used above */}
            <button className='btn btn-primary' onClick={() => this.addItem()}
            style={{width: '30%'}}>Add</button>
          </div>

          <ul className='list-group'>
            {/* List array is mapped through, creating a new item for each item in the array */}
            {this.state.list.map(item => {
              return (
                <li className='list-group-item inputAndBtn' key={item.id}>
                  <p>{item.value}</p>
                  <button className='btn btn-success' onClick={() => this.deleteItem(item.id)}
                  style={{width: '30%'}}>Done!</button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    );
  }
}


export default App;
