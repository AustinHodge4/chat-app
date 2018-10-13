import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { IconSeparator, FontIcon, Avatar} from 'react-md';

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
        }

    }
    
    
    
    
    componentDidMount() {
    }
    render() {
        const {isLoading} = this.state;
        const Item = ({ label, children }) => (
            <IconSeparator label={label} iconBefore component="li" className="md-cell md-cell--12">
              {children}
            </IconSeparator>
          );
        return (
            isLoading == false ? null : (
                <ul className="md-list-unstyled md-grid avatars__examples">
    
    <Item label="An Avatar with a FontAwesome icon.">
      <Avatar icon={<FontIcon iconClassName="fa fa-rocket" />} />
    </Item>
    
    <Item label="An Avatar using a letter and the default color.">
      <Avatar>M</Avatar>
    </Item>
    <Item label="An Avatar using a letter and a random color.">
      <Avatar random>O</Avatar>
    </Item>
  </ul>
            )
            
          );
    }
}
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Login />, wrapper) : null;