import React, { Component } from "react";
import PropTypes from "prop-types";
import './global.js';
import Form from './Form';
import Messages from "./Messages";
import {Grid, Cell} from "react-md";


class Channel extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading...",
      page: 2,
      channel: props.channel,
    }
  }
  static propTypes = {
    channel: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
  };

  loadMoreMessages = () => {
    fetch(this.props.endpoint+""+this.state.page).then(response => {
      return response.json();
    }).then(messages =>{
      console.log(messages);
      if(Object.keys(messages).length != 0){
      this.setState(prevState => ({
        data: messages.concat(prevState.data),
        page: prevState.page + 1
      }))
    };
    })
  }
  componentDidMount() {
    chat_socket.onopen = function(){
      console.log("Connected to chat socket: ");
    }
    chat_socket.onclose = function(){
      console.log("Disconnected from chat socket: ");
    }
    chat_socket.onmessage = function(m){
      var message = JSON.parse(m.data);
      console.log("Message:")
      console.log(message.message);
      this.setState(prevState => ({
        data: [...prevState.data, message.message]
      }))
    }.bind(this)

    fetch(this.props.endpoint+"1")
      .then(response => {
        if (response.status !== 200) {
          return this.setState({ placeholder: "Something went wrong" });
        }
        return response.json();
      })
      .then(data => {
        this.setState({ data: data, loaded: true }); 
        console.log(data); 
      });
    
  }

  render() {
    const { data, loaded, placeholder, channel } = this.state;
    return (loaded) ? (    
      <div>    
        <Grid className="grid-example">
          <Cell size={10} offset={1}><Messages messages={data} /></Cell>
         <Cell size={10} offset={1}>
        <Form callback={this.loadMoreMessages} />
        </Cell>
        </Grid>
      
        </div>
      ) : ( <p>{placeholder}</p>);
  }
}
export default Channel;
