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
      prevScrollHeight: null,
    }
    this.scroll = React.createRef();
  }
  static propTypes = {
    mediaClass: PropTypes.string,
    channelAccess: PropTypes.bool.isRequired,
    channel: PropTypes.object.isRequired,
    endpoint: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    joinCallback: PropTypes.func.isRequired,
    leaveCallback: PropTypes.func.isRequired
  };

  onResize(width, height){
    this.setState({scrollBoxHeight: "calc(100vh - "+(height)+"px)", messageBoxHeight: height+'px'});
  }
  loadMoreMessages = () => {
    return fetch(this.props.endpoint+""+this.state.page).then(response => {
      return response.json();
    }).then(messages =>{
      //console.log(messages);
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
      if(message.event == 'message_channel'){
        //console.log("Message:")
        //console.log(message.message);
        this.setState(prevState => ({
          data: [message.message, ...prevState.data]
        }))
      }
      else if(message.event == 'join_channel'){
        
        if(this.props.user.username == message.user.username){
          this.props.joinCallback(message.channel_name);
          console.log("You Join");
        } else {
          console.log("Someone Join")
          this.props.leaveCallback(false);
        }
      }
      else if(message.event == 'leave_channel' ){
        
        if(this.props.user.username == message.user.username){
          this.props.leaveCallback(true);
          console.log("You Leave")
        } else {
          console.log("Someone Left")
          this.props.leaveCallback(false);
        }
      }
      else if(message.event == 'delete_channel'){
       
        if(this.props.channel){
          if(this.props.channel.channel_name == message.channel_name){
            console.log("You Deleted Channel")
            this.props.leaveCallback(true);
          }
          else{
            console.log("Somone Delete Channel")
            this.props.leaveCallback(false);
          }
        }
      }
      else if(message.event == 'add_channel'){
       
        if(this.props.user.username != message.user.username){
          console.log("Someone Add Channel")
          this.props.leaveCallback(false);
        }
        else{
          console.log("You Add Channel")
        }

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
        //console.log(data);
        this.scrollDown(this.refs['scroll-box']);
      });
      
  }
  scrollDown(element){
    if(element){
      element.scrollTop = element.scrollHeight;
    }
  }
  handleScroll(e){
    if(e.target.scrollTop <= 0){
      this.setState({prevScrollHeight: e.target.scrollHeight}, () => {
        this.loadMoreMessages().then(data => {
          this.refs['scroll-box'].scrollTop =  this.refs['scroll-box'].scrollHeight - this.state.prevScrollHeight;
        });      
      });
      
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
        <div ref="scroll-box" style={messagesContainer} onScroll={(e) => {this.handleScroll(e)}}>    
          <Grid style={scrollBox}>
            <Cell size={12} style={flexBox}><Messages messages={data} mobile={this.props.mediaClass == ''} /></Cell>
          </Grid>
        </div>
        <ReactResizeDetector handleHeight resizableElementId={'2'} onResize={(width, height) => this.onResize(width, height)}/>
        <Toolbar id={'2'} fixed={true} style={messageBox} themed={true} title={<Form className={'md-title md-title--toolbar '+this.props.mediaClass} mediaClass={this.props.mediaClass} disable={!channelAccess} channel={channel} user={this.props.user} />} />
      </div>
      ) : ( <p>{placeholder}</p>);
  }
}
export default Channel;
