import React, { Component } from "react";
import PropTypes from "prop-types";
import './global.js';
import Form from './Form';
import Messages from "./Messages";
import {Grid, Cell, Toolbar} from "react-md";
import ReactResizeDetector from 'react-resize-detector';

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
      scrollBoxHeight: 'calc(100vh - 144px)',
      messageBoxHeight: '72px',
    }
    this.scroll = React.createRef();
  }
  static propTypes = {
    mediaClass: PropTypes.string,
    channelAccess: PropTypes.bool.isRequired,
    channel: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
  };

  onResize(width, height){
    console.log(width);
    console.log(height);
    this.setState({scrollBoxHeight: "calc(100vh - "+(height)+"px)", messageBoxHeight: height+'px'});
  }
  loadMoreMessages = () => {
    fetch(this.props.endpoint+""+this.state.page).then(response => {
      return response.json();
    }).then(messages =>{
      console.log(messages);
      if(Object.keys(messages).length != 0){
      this.setState(prevState => ({
        data: prevState.data.concat(messages),
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
          data: [message.message, ...prevState.data]
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
  scrollDown(element){
    if(element){
      element.scrollTop = element.scrollHeight;
    }
  }
  handleScroll(e){
    if(e.target.scrollTop <= 0){
      console.log("Top");
      this.loadMoreMessages();      
    }
  }
  render() {
    const { data, loaded, placeholder, channel, channelAccess, scrollBoxHeight, messageBoxHeight } = this.state;
    const messagesContainer = {
      bottom: '0%',
      overflow: 'auto',
      height: scrollBoxHeight,
    }
    const scrollBox = {
      paddingBottom: messageBoxHeight,
      minHeight: scrollBoxHeight
    }
    const messageBox = {
      top: 'auto',
      bottom: '0',
      height: 'auto',
      maxHeight: '40%',
    }
    const flexBox = {
      display: 'flex',
      flexFow: 'column',
      flexDirection: 'column-reverse',
      alignItems: 'flex-end'
    }
    return (loaded) ? (   
      <div> 
        <div ref={(element) => (this.scrollDown(element))} style={messagesContainer} onScroll={(e) => {this.handleScroll(e)}}>    
          <Grid style={scrollBox}>
            <Cell size={12} style={flexBox}><Messages messages={data} /></Cell>
          </Grid>
        </div>
        <ReactResizeDetector handleHeight resizableElementId={'2'} onResize={(width, height) => this.onResize(width, height)}/>
        <Toolbar id={'2'} fixed={true} style={messageBox} themed={true} title={<Form className={'md-title md-title--toolbar '+this.props.mediaClass} mediaClass={this.props.mediaClass} disable={!channelAccess} channel={channel} />} />
      </div>
      ) : ( <p>{placeholder}</p>);
  }
}
export default Channel;
