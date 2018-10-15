import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Channel from "./Channel";
import './global.js';
import { NavigationDrawer, Autocomplete, FontIcon, Button, Grid, Cell} from 'react-md';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            channels: [],
            joinedChannels: [],
            channelSelected: false,
            selectedChannelIndex: null,
            activeChannelId: null,
            lastChannelIndex: 1,
            isLoading: true,
            channelAccess: false,
            autocompleteValue: '',
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
            ],
            mediaClass: '',
        }

    }
    
    static propTypes = {
        endpoint: PropTypes.string.isRequired,
    };
    createNavItem(prevState, data){
        let items = [];
        let lastChannelIndex = this.state.lastChannelIndex;
        const activeListItemStyle = {
            backgroundColor: '#673ab71c'
        }
        for(var id in Object.entries(data)){
            let channel = data[id];
            let found = prevState.filter(obj => {
                return obj.channel_id === channel.channel_id
            })[0];

            if(!found){
                console.log(channel);
                items.push({key: channel.channel_id,
                            active: this.state.activeChannelId === channel.channel_id,
                            activeBoxStyle: activeListItemStyle,
                            leftIcon: <FontIcon key={channel.channel_id+"-icon"}>people</FontIcon>,
                            onClick: (e) => this.onSelectedChannel(e, channel.channel_id),
                            primaryText: '# '+channel.channel_id
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
        // console.log(navItems);
        // console.log(lastChannelIndex);
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
            // console.log(items);
            this.setState({channels: data, joinedChannels: data, navItems: items[0], lastChannelIndex: items[1], isLoading: false }); 
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
            if(selectedChannel.active)
                change_socket(channel_id+'/');
            else
                change_socket("");

            this.setState(prevState => ({navItems: navItems, selectedChannelIndex: channel_index, activeChannelId: channel_id, channelSelected: selectedChannel.active, channelAccess: prevState.selectedChannelIndex == index}));
        }
    }
    onAutoComplete(suggestion, suggestionIndex, matches){
        console.log(suggestion)
        this.setState({activeChannelId: suggestion, channelSelected: true, autocompleteValue: ''})
    }
    onAutoCompleteChange(text, e){
        this.setState({autocompleteValue: text})
    }
    onButtonClick(e, type){
        if(type == 'Join'){
            // Fetch api
            this.setState({channelAccess: true});
        }
        else if(type == 'Leave'){
            // Fetch
            this.setState({channelAccess: false});
        }
    }
    mediaChange(type, media){
        let media_class = null;
        console.log(media);
        if(media.desktop){
            media_class = 'md-transition--deceleration md-title--permanent-offset'
        } else {
            media_class = ''
        }
        this.setState({mediaClass: media_class})
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
        const {navItems, channelSelected, activeChannelId, isLoading, channelAccess, mediaClass, channels, autocompleteValue} = this.state;
        const divStyle = {
            filter: 'blur(5px)',
            width: '100%',
            height: '90vh',
            pointerEvents: 'none'
          };
        const h3Style = {
            top: '32%',
            zIndex: '1',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            position: 'fixed',
        };
        const channelStyle = {
            fontWeight: '300'
        }
        const toolbarStyle = {
            marginTop: '0px'
        }
        return (
            isLoading ? null : (
            <NavigationDrawer
              drawerId="main-navigation"
              drawerTitle="chat-app"
              toolbarId="main-toolbar"
              toolbarTitle={channelSelected? '# '+activeChannelId : "Select a Channel"}
              toolbarTitleStyle={channelStyle}
              navItems={navItems}
              onMediaTypeChange={(type, media) => this.mediaChange(type, media)}
              toolbarChildren={channelAccess ? null : <Autocomplete
                                                            key={'search-channels'}
                                                            id={'search-channels'}
                                                            block
                                                            placeholder="# Search for a Channel"
                                                            data={channels}
                                                            dataLabel={'channel_id'}
                                                            dataValue={'channel_id'}
                                                            toolbar
                                                            value={autocompleteValue}
                                                            filter={Autocomplete.caseInsensitiveFilter}
                                                            style={{marginLeft: '32px', maxWidth: '300px'}}
                                                            listStyle={{maxWidth: '300px'}}
                                                            onChange={(text, e) => this.onAutoCompleteChange(text, e)}
                                                            onAutocomplete={(suggestion, suggestionIndex, matches) => (this.onAutoComplete(suggestion, suggestionIndex, matches))}
                                                        />}
              toolbarActions={channelSelected ? (
                  channelAccess ? (<Button onClick={(e) => this.onButtonClick(e, "Leave")} flat primary swapTheming>Leave Channel</Button>) 
                    : (<Button onClick={(e) => this.onButtonClick(e, "Join")} flat primary swapTheming>Join Channel</Button>)) : null}
            >
                               {channelSelected ? (
                               channelAccess? (<Channel key={activeChannelId} mediaClass={mediaClass} channelAccess={channelAccess} channel={activeChannelId} endpoint={window.location.href+activeChannelId+'/messages?page='} />)
                               : (
                                <div>
                                    <Grid style={{display: 'contents'}}>
                                        <Cell size={12} offset={mediaClass == '' ? 0 : 3}>
                                    <div className={'md-display-3'} style={h3Style}>Join <i style={{fontWeight: '200'}}># {activeChannelId}</i> to view messages </div>
                                    </Cell>
                                    </Grid>
                                    <div style={divStyle}>
                                        <Channel key={activeChannelId} mediaClass={mediaClass} channelAccess={channelAccess} channel={activeChannelId} endpoint={window.location.href+activeChannelId+'/messages?page='} />
                                    </div>
                                </div>
                               )) : null}
            </NavigationDrawer>
            )
            
          );
    }
}
const wrapper = document.getElementById("default");
wrapper ? ReactDOM.render(<App endpoint={window.location.href+'rooms'} />, wrapper) : null;