import React, { Component } from "react";
import PropTypes from "prop-types";
import {Grid, Cell, Button, TextField, Paper} from 'react-md';

import './global.js';

class Form extends Component {
  static propTypes = {
    disable: PropTypes.bool.isRequired, 
    callback: PropTypes.func,
    channel: PropTypes.string.isRequired
  };
  constructor(props){
    super(props);
    this.state = {
      name: "Austin",
      message: "",
      disable: props.disable,
      channel: props.channel
    };
  }
  onClick = () => {
    this.props.callback();
  }
  handleChange(value, e){
    this.setState({ message: value});
  };
  handleSubmit = e => {
    e.preventDefault();
    const { name, message} = this.state;
    if(/\S/.test(message)){    
      this.setState({'message': ''});
      const message_data = { type: 'message_event', name: name, message: message };
      chat_socket.send(JSON.stringify(message_data));
    }
  };
  render() {
    const { name, message, channel} = this.state;
    const buttonStyle = {
      float: 'right'
    }
    const Buttons = () => (
      <div>
        <Button style={buttonStyle} onClick={this.onClick} disabled={this.state.disable} icon primary>add_circle</Button>
        <Button style={buttonStyle} type="submit" disabled={this.state.disable} icon primary>send</Button>  
      </div>
    );
    return (
        <form onSubmit={this.handleSubmit}>
          <input type="hidden" name="name" value={this.state.name}/>
          <Grid>
            <Cell size={12}>
              <Paper zDepth={1}>
                <Grid>
                  <Cell size={12} align={'bottom'}>
                    <TextField
                      id="message-body"
                      name="message"
                      placeholder={"Message #"+channel}
                      block
                      paddedBlock
                      rows={1}
                      maxRows={0}
                      lineDirection={'right'}
                      rightIcon={<Buttons />}
                      onChange={(value, e) => this.handleChange(value, e)}
                      value={this.state.message}
                      disabled={this.state.disable}
                    />
                    
                  </Cell>
                  {/* <Cell size={2} style={{marginBottom: '16px'}} align={'bottom'} position={'right'}>
                    
                  </Cell> */}
                </Grid>
              </Paper>
            </Cell>
          </Grid>
        </form>
    );
  }
}
export default Form;