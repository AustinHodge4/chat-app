import React, {Component} from "react";
import PropTypes from "prop-types";
import Message from './Message';
import {Grid, Cell} from 'react-md';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
  });

class Messages extends Component{
  static propTypes = {
    mobile: PropTypes.bool.isRequired,
    messages: PropTypes.array.isRequired
  };
  render(){
    
    return(
      !this.props.messages.length ? (
        <p>Nothing to show</p>
      ) : (
        this.props.messages.map((message, index) => <Message key={index} data={message} mobile={this.props.mobile} />)   
    ));
  }
}
export default (Messages);