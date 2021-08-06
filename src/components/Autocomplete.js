import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from 'axios';

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
  }

  onChange = async (e) => {
    //const { suggestions } = this.props;
    const userInput = e.currentTarget.value;
    let filteredSuggestions = []
    if(userInput.length > 3) {
        const response = await axios.get(`https://www.omdbapi.com/?apikey=81df2a82&s=${userInput}`);
        console.log(response.data);
        if(response.data.Response === 'True') {
            filteredSuggestions = response.data.Search.map(obj => {
                return obj.Title;
            })
        
            this.setState({
                activeSuggestion: 0,
                filteredSuggestions,
                showSuggestions: true,
                userInput: userInput
            });
        } else {
            this.setState({
                activeSuggestion: 0,
                filteredSuggestions,
                showSuggestions: false,
                userInput: userInput
            });
        }
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

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
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
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              if (index === activeSuggestion) {
                className = "";
              }

              return (
                <li key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions</em>
          </div>
        );
      }
    }

    return (
      <React.Fragment>
        <input
          type="search"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        {suggestionsListComponent}
      </React.Fragment>
    );
  }
}

export default Autocomplete;
