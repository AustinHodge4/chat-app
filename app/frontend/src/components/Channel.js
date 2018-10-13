import React, { Component } from "react";
import PropTypes from "prop-types";
import './global.js';
import Form from './Form';
import Messages from "./Messages";
import {Grid, Cell, Toolbar} from "react-md";


class Channel extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: [],
      loaded: false,
      placeholder: "Loading...",
      page: 2,
      channel: props.channel,
      channelAccess: props.channelAccess,
    }
  }
  static propTypes = {
    channelAccess: PropTypes.bool.isRequired,
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
      console.log(message);
      if(message.type == 'message_event'){
        console.log("Message:")
        console.log(message.message);
        this.setState(prevState => ({
          data: [...prevState.data, message.message]
        }))
      }
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
    const { data, loaded, placeholder, channel, channelAccess } = this.state;
    const scrollBox = {
      overflowY: 'scroll',
      maxHeight: '76vh',
      height: '76vh'
    }
    const messageBox = {
      top: 'auto',
      bottom: '0',
      height: '10%'
    }
    const FormArea = () => (
      <Grid>
        <Cell size={12}>
        <Form disable={!channelAccess} callback={this.loadMoreMessages} channel={channel} />
          </Cell>
      </Grid>
    )
    return (loaded) ? (    
      <div>    
        <Grid className="grid-example">
          <Cell size={12} style={scrollBox}><Messages messages={data} /></Cell>
        </Grid>
        <Toolbar fixed={true} style={messageBox} themed={true} children={<FormArea />} />
      </div>
      ) : ( <p>{placeholder}</p>);
  }
}
export default Channel;
