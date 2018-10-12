import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Channel from "./Channel";
import './global.js';
import { NavigationDrawer, FontIcon, MenuButton} from 'react-md';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            channels: [],
            channelSelected: false,
            selectedChannelIndex: null,
            activeChannelId: null,
            lastChannelIndex: 1,
            isLoading: true,

            navItems: [
                {
                    key:"channels-header",
                    subheader: true,
                    primaryText: "Channels",
                },
                { key: 'divider', divider: true }, 
                {
                    key: 'logout', 
                    primaryText:'Log out',
                    leftIcon: <FontIcon>keyboard_arrow_left</FontIcon>
                }
            ]
        }

    }
    
    static propTypes = {
        endpoint: PropTypes.string.isRequired,
    };
    createNavItem(prevState, data){
        let items = [];
        let lastChannelIndex = this.state.lastChannelIndex;

        for(var id in Object.entries(data)){
            let channel = data[id];
            let found = prevState.filter(obj => {
                return obj.channel_id === channel.channel_id
            })[0];

            if(!found){
                console.log(channel);
                items.push({key: channel.channel_id,
                            active: this.state.activeChannelId === channel.channel_id,
                            leftIcon: <FontIcon key={channel.channel_id+"-icon"}>people</FontIcon>,
                            onClick: (e) => this.onSelectedChannel(e, channel.channel_id),
                            primaryText: channel.channel_id
                })
            }
            else {
                for(var index = prevState.length; index > 0; index--){
                    let c = prevState[index];
                    if(channel.id == c.key){
                        prevState.splice(i, 1);
                    }
                }
            }
        }
        const navItems = this.state.navItems;
        if(prevState.length > 0){
            for(var index = prevState.length; index > 0; index--){
                let c = prevState[index];
                for(var index = navItems.length; index > 0; index--){
                    let channel = navItems[index];
                    if(channel.key == c.key){
                        navItems.splice(index, 1);
                        lastChannelIndex--;
                        break;
                    }
                }
                prevState.splice(i, 1);
            }
        }
        navItems.splice(lastChannelIndex, 0, ...items);
        lastChannelIndex += items.length;
        console.log(navItems);
        console.log(lastChannelIndex);
        return [navItems, lastChannelIndex];
    }
    fetchRooms(){
        fetch(this.props.endpoint)
        .then(response => {
            if (response.status !== 200) {
                return this.setState({ placeholder: "Something went wrong" });
            }
            return response.json();
        })
        .then(data => {
            let items = this.createNavItem(this.state.channels, data);
            console.log(items);
            this.setState(prevState => ({channels: data, navItems: items[0], lastChannelIndex: items[1], isLoading: false })); 
        });
    }
    onSelectedChannel(e, channel_id){
        const navItems = this.state.navItems;
        let selectedChannel = null;
        let channel_index = null;
        for(var index = 0; index < navItems.length; index++){
            let channel = navItems[index];

            if (channel.divider || channel.subheader || channel.key == 'logout')
                continue;

            if(channel.key == channel_id){
                channel.active = !channel.active;
                selectedChannel = channel;
                channel_index = index;
                continue;
            }
            channel.active = false;
        }
        if(selectedChannel){
            if(selectedChannel.active){
                change_socket(channel_id+'/');
                this.setState({channelSelected: false});
            }
            else
                change_socket("");

            this.setState(prevState => ({navItems: navItems, selectedChannelIndex: channel_index, activeChannelId: channel_id, channelSelected: selectedChannel.active}));
        }
    }
    componentDidMount() {
        
        chat_socket.onopen = function(){
            console.log("Connected to chat socket: No room selected");
        }
        chat_socket.onclose = function(){
            console.log("Disconnected from chat socket: No room selected");
        }
        chat_socket.onmessage = function(m){
            var data = JSON.parse(m.data);
            console.log("Message:")
            console.log(data.type);
            console.log(data.message);
            this.fetchRooms();
        }.bind(this)
        this.fetchRooms();
    }
    render() {
        const {navItems, channelSelected, activeChannelId, isLoading} = this.state;

        return (
            isLoading ? null : (
            <NavigationDrawer
              drawerId="main-navigation"
              drawerTitle="chat-app"
              toolbarId="main-toolbar"
              toolbarTitle={channelSelected? activeChannelId : "Select a Channel"}
              navItems={navItems}
              toolbarActions={channelSelected ? (<MenuButton
                id="menu-button-2"
                icon
                menuItems={['Item One', 'Item Two', 'Item Three', 'Item Four']}
              >
                more_vert
              </MenuButton>) : null}
            >
                               {channelSelected ? (<Channel key={activeChannelId} channel={activeChannelId} endpoint={window.location.href+activeChannelId+'/messages?page='} />) : null}
            </NavigationDrawer>
            )
            
          );
    }
}
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App endpoint={window.location.href+'rooms'} />, wrapper) : null;