import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from 'axios';
import { debounce } from "throttle-debounce";

const debounceTime = 250; //this is configurable
export class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };
  static defaultProperty = {
    suggestions: []
  };
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    };
    this.autocompleteSearchDebounced = debounce(debounceTime, this.autocompleteSearch);
    this.onClick = this.onClick.bind(this);
  }

  autocompleteSearch = async (userInput) => {
        let filteredSuggestions = [];
        const response = await axios.get(`https://www.omdbapi.com/?apikey=81df2a82&s=${encodeURI(userInput)}`);
        if(response.data.Response === 'True') {
            filteredSuggestions = response.data.Search.map(obj => {
                return obj.Title;
            })
        
            this.setState({
                activeSuggestion: 0,
                filteredSuggestions,
                showSuggestions: true
            });
        } else {
            this.setState({
                activeSuggestion: 0,
                filteredSuggestions,
                showSuggestions: true
            });
        }
  }

  onChange = async (e) => {
    const userInput = e.currentTarget.value;
    let filteredSuggestions = [];
    if(userInput.length > 3) {
        this.setState({
            userInput: userInput
        });
        this.autocompleteSearchDebounced(userInput)
    }
    else {
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: false,
            userInput: e.currentTarget.value
          });
    }
  };

  onClick = e => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
  };
  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      });
    } else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    } else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  onBlur= () => {
    if(!this.state.className) {
        this.setState({
            className: 'hide'
        })
    }
  }

  onFocus = () => {
    if(this.state.className) {
        this.setState({
            className: ''
        })
    }
  }

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      onBlur,
      onFocus,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;
    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className={"suggestions " + this.state.className}>
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              if (index === activeSuggestion) {
                className = "highlight";
              }

              return (
                <li key={index} onMouseDown={onClick} className={className}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <ul className="suggestions">
            <li>No suggestions</li>
          </ul>
        );
      }
    }

    return (
      <React.Fragment>
        <h3>AutoComplete</h3>  
        <input
          className="searchbox"
          type="search"
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          onFocus={onFocus}
          value={userInput}
        />
        {suggestionsListComponent}
      </React.Fragment>
    );
  }
}

export default Autocomplete;
