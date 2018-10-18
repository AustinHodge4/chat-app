import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Channel from "./Channel";
import './global.js';
import { NavigationDrawer, Autocomplete, DialogContainer, 
    TextField,  FontIcon, Button, Grid, Cell, MenuButton, ListItem,
    Layover, List, ListItemControl, Avatar} from 'react-md';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            channels: [],
            subscribedChannels: [],
            channelSelected: false,
            user: null,
            activeChannel: null,
            lastChannelIndex: 1,
            isLoading: true,
            showCreateChannelDialog: false,
            showDeleteChannelDialog: false,
            showChannelUsersDialog: false,
            newChannelName: '',
            createChannelError: '',
            createChannelErrorState: false,
            channelAccess: false,
            autocompleteValue: '',
            navItems: [
                {
                    key:"channels-header",
                    subheader: true,
                    primaryText: "Subscribed Channels",
                },
                {
                    key: 'create-channel',
                    primaryText: 'Create Channel',
                    rightIcon: <FontIcon key={"create-channel-icon"} primary>add_circle</FontIcon>,
                    onClick: (e) => this.onOpenCreateChannelDialog(),
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
        // console.log("Old")
        // console.log(prevState);

        // console.log("New")
        // console.log(data);
        for(var id in Object.entries(data)){
            let channel = data[id];
            let found = prevState.filter(obj => {
                return obj.channel_name === channel.channel_name
            })[0];
            if(!found){
                items.push({key: channel.channel_name,
                            active: this.state.activeChannel ? this.state.activeChannel.channel_name === channel.channel_name : false,
                            activeBoxStyle: activeListItemStyle,
                            leftIcon: <FontIcon key={channel.channel_name+"-icon"}>people</FontIcon>,
                            onClick: (e) => this.onSelectedChannel(e, channel.channel_name),
                            primaryText: '# '+channel.channel_name,
                            channel_name: channel.channel_name
                })
            }
            else {
                for(let index = prevState.length-1; index > 0; index--){
                    let c = prevState[index];
                    if(channel.channel_name == c.channel_name){
                        prevState.splice(index, 1);
                    }
                }
            }
        }
        const navItems = this.state.navItems;
        if(prevState.length > 0){
            for(var i = prevState.length-1; i > 0; i--){
                let c = prevState[i];
                for(var index = navItems.length-1; index > 0; index--){
                    let channel = navItems[index];
                    if (channel.divider || channel.subheader || channel.key == 'logout' || channel.key == 'create-channel')
                        continue;

                    if(channel.key == c.channel_name){
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
        return [navItems, lastChannelIndex];
    }
    fetchChannels(){
        return fetch(window.location.href+'channels')
        .then(response => {
            if (response.status !== 200) {
                return this.setState({ placeholder: "Something went wrong" });
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            let items = this.createNavItem(this.state.subscribedChannels, data.subscribed_channels);
            this.setState({channels: data.all_channels, subscribedChannels: data.subscribed_channels, navItems: items[0], lastChannelIndex: items[1], isLoading: false }); 
        })
    }
    getChannelObject(channel_name){
        let channels = this.state.channels
        for(var id in Object.entries(channels)){
            let channel = channels[id];
            if(channel.channel_name == channel_name)
                return channel
        }
        return null;
    }
    isChannelSubscribed(channel_name){
        let subscribed_channels = this.state.subscribedChannels;
        for(var id in Object.entries(subscribed_channels)){
            let channel = subscribed_channels[id];
            if(channel.channel_name == channel_name){
                return true;
            }
        }
        return false;
    }
    fetchUser(){
        fetch(window.location.href+'user')
        .then(response => {
            if (response.status !== 200) {
                return this.setState({ placeholder: "User not found" });
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            this.setState({user: data}); 
        });
    }
    onSelectedChannel(e, channel_name){
        const navItems = this.state.navItems;
        let selectedChannel = null;
        console.log("Selected");
        console.log(channel_name);
        for(var index = 0; index < navItems.length; index++){
            let channel = navItems[index];

            if (channel.divider || channel.subheader || channel.key == 'logout' || channel.key == 'create-channel')
                continue;

            if(channel.key == channel_name){
                channel.active = !channel.active;
                selectedChannel = channel;
                continue;
            }
            channel.active = false;
        }
        if(selectedChannel){
            if(selectedChannel.active)
                change_socket(channel_name+'/');
            else
                change_socket("");
            this.setState(prevState => ({navItems: navItems, activeChannel: this.getChannelObject(channel_name), channelSelected: selectedChannel.active, channelAccess: (selectedChannel.active && this.isChannelSubscribed(selectedChannel.channel_name))}));
        }
    }
    onOpenChannelUsersDialog(e){
        this.setState({showChannelUsersDialog: true});
    }
    onCloseChannelUsersDialog(e){
        this.setState({showChannelUsersDialog: false});
    }
    onOpenDeleteChannelDialog(e){
        this.setState({showDeleteChannelDialog: true});
    }
    onCloseDeleteChannelDialog(e){
        this.setState({showDeleteChannelDialog: false});
    }
    onOpenCreateChannelDialog(e){
        this.setState({showCreateChannelDialog: true})
    }
    onCloseCreateChannelDialog(e){
        this.setState({showCreateChannelDialog: false, newChannelName: ''})
    }
    onCreateChannel(e){
        function get_cookie(name) {
            var value;
            if (document.cookie && document.cookie !== '') {
                document.cookie.split(';').forEach(function (c) {
                    var m = c.trim().match(/(\w+)=(.*)/);
                    if(m !== undefined && m[1] == name) {
                        value = decodeURIComponent(m[2]);
                    }
                });
            }
            return value;
        }
        if(/\S/.test(this.state.newChannelName)){   
            let payload = {channel_name: this.state.newChannelName, user: this.state.user}
            fetch(window.location.href+'channels/', {
                method: 'POST',
                credentials: "same-origin",
                headers: {
                    "X-CSRFToken": get_cookie('csrftoken'),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.status !== 200) {
                    return this.setState({ placeholder: "Fail to create channel" });
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if(data.success){
                    this.fetchChannels().then(done => {
                    this.onSelectedChannel(null, data.channel_name)});
                    this.setState({showCreateChannelDialog: false, newChannelName: ''})
                } else {
                    this.setState({createChannelErrorState: true, createChannelError: data.reason})
                }
            });
            
        } else {
            this.setState({createChannelErrorState: true, createChannelError: 'Enter a channel name!'})
        }
    }
    onAutoComplete(suggestion, suggestionIndex, matches){
        this.setState({autocompleteValue: ''})
        change_socket(suggestion+'/');
        if(this.isChannelSubscribed(suggestion))
            this.onSelectedChannel(null, suggestion)
        else
            this.setState({activeChannel: this.getChannelObject(suggestion), channelSelected: true, channelAccess: false})
    }
    onAutoCompleteChange(text, e){
        this.setState({autocompleteValue: text})
    }
    onButtonClick(e, type){
        if(type == 'Join'){
            // Fetch api
            const message_data = { type: 'join_channel', user: this.state.user};
            chat_socket.send(JSON.stringify(message_data));
            this.setState({channelAccess: true});
        }
        else if(type == 'Leave'){
            // Fetch
            const message_data = { type: 'leave_channel', user: this.state.user};
            chat_socket.send(JSON.stringify(message_data));
            this.setState({channelAccess: false});
        }
        else if(type == 'Delete'){
            const message_data = { type: 'delete_channel', user: this.state.user};
            chat_socket.send(JSON.stringify(message_data));
            this.setState({channelAccess: false, channelSelected: false, showDeleteChannelDialog: false});
        }
    }
    onJoinChannel(channel_name){
        console.log(channel_name);
        this.fetchChannels();
        this.onSelectedChannel(null, channel_name);
    }
    onLeaveChannel(){
        console.log("Load Channels");
        this.fetchChannels();
        this.setState({channelSelected: false, channelAccess: false});

    }
    onMediaChange(type, media){
        let media_class = null;
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
            this.fetchChannels();
        }.bind(this)
        this.fetchUser();
        this.fetchChannels();
    }
    render() {
        const {navItems, channelSelected, activeChannel, isLoading, channelAccess, mediaClass, 
            channels, autocompleteValue, showCreateChannelDialog, showDeleteChannelDialog, showChannelUsersDialog,
            createChannelError, createChannelErrorState, newChannelName, user} = this.state;
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
        const nameStyle = {
            display: 'inline',
            marginRight: '8px',
            letterSpacing: '0',
            fontSize: '24px'
        }
        const ChatOptions = () => (
            <MenuButton
                id="menu-button-2"
                icon
                centered
                className={'md-btn md-btn--icon md-btn--hover md-pointer--hover md-inline-block md-btn--toolbar md-toolbar--action-right'}
                menuItems={[
                    <ListItem key={1} onClick={(e) => this.onOpenChannelUsersDialog(e)} primaryText="View People" />,
                        (activeChannel.creator != null) && (user.username == activeChannel.creator.username) ? 
                        <ListItem key={2} onClick={(e) => this.onOpenDeleteChannelDialog(e)} primaryText="Delete Channel" /> :
                        (activeChannel.creator != null) ? <ListItem key={2} onClick={(e) => this.onButtonClick(e, "Leave")} primaryText="Leave Channel" /> : <div key={2}></div>
                ]}        
                position={Layover.Positions.BOTTOM_RIGHT}     
                >
                more_vert
            </MenuButton>
        );
        return (
            isLoading ? null : (
            <NavigationDrawer
              drawerId="main-navigation"
              drawerTitle="chat-app"
              toolbarId="main-toolbar"
              toolbarTitle={channelSelected? '# '+activeChannel.channel_name : "Select a Channel"}
              toolbarTitleStyle={channelStyle}
              navItems={navItems}
              onMediaTypeChange={(type, media) => this.onMediaChange(type, media)}
              toolbarChildren={channelAccess ? null : <Autocomplete
                                                            key={'search-channels'}
                                                            id={'search-channels'}
                                                            block
                                                            placeholder={mediaClass == '' ? '# Search': '# Search for a Channel'}
                                                            data={channels}
                                                            dataLabel={'channel_name'}
                                                            dataValue={'channel_name'}
                                                            toolbar
                                                            value={autocompleteValue}
                                                            filter={Autocomplete.caseInsensitiveFilter}
                                                            style={{marginLeft: '32px', maxWidth: '300px'}}
                                                            listStyle={{maxWidth: '300px'}}
                                                            onChange={(text, e) => this.onAutoCompleteChange(text, e)}
                                                            onAutocomplete={(suggestion, suggestionIndex, matches) => (this.onAutoComplete(suggestion, suggestionIndex, matches))}
                                                        />}
              toolbarActions={channelSelected ? (
                  channelAccess ? (<ChatOptions />) 
                    : (<Button onClick={(e) => this.onButtonClick(e, "Join")} flat primary swapTheming>Join Channel</Button>)) : null}
            >
            <DialogContainer
                id="create_channel_dialog"
                visible={showCreateChannelDialog}
                onHide={(e) => {(this.onCloseCreateChannelDialog(e))}}
                actions={[<Button flat primary onClick={(e) => this.onCreateChannel(e)}>Create</Button>]}
                title="Create Channel"
            >
                <TextField
                    id="channel-name"
                    label="Name"
                    placeholder="Channel name"
                    value={newChannelName}
                    error={createChannelErrorState}
                    errorText={createChannelError}
                    onChange={(value, e) => this.setState({newChannelName: value, createChannelError: '', createChannelErrorState: false})}
                />
            </DialogContainer>

            <DialogContainer
                id="delete_channel_dialog"
                visible={showDeleteChannelDialog}
                onHide={(e) => {(this.onCloseDeleteChannelDialog(e))}}
                actions={[<Button flat secondary onClick={(e) => this.onButtonClick(e, 'Delete')}>Delete Channel</Button>]}
                title="Delete Channel?"
            />
            {activeChannel != null ? 
            <DialogContainer
                id="channel_users_dialog"
                visible={showChannelUsersDialog}
                onHide={(e) => {(this.onCloseChannelUsersDialog(e))}}
                title={"People in #"+ activeChannel.channel_name}
            >
                <List>
                {activeChannel.users.map((user, index) => 
                    <ListItem
                        key={index}
                        primaryText={user.username}
                        primaryTextStyle={nameStyle}
                        secondaryText={user.first_name + " " + user.last_name}
                        leftAvatar={ <Avatar style={{border: 'none', width: '52px', height: '52px', borderRadius: '10%'}} src={'http://i.pravatar.cc/150?u='+user.username+'@pravatar.com'} />}
                    />)}
                </List>
            </DialogContainer>
            : null}

                               {channelSelected ? (
                               channelAccess? (<Channel key={activeChannel.channel_name} mediaClass={mediaClass} user={user} channelAccess={channelAccess} 
                                                        channel={activeChannel} joinCallback={(channel_name) => this.onJoinChannel(channel_name)} leaveCallback={() => this.onLeaveChannel()}
                                                        endpoint={window.location.href+activeChannel.channel_name+'/messages?page='} />)
                               : (
                                <div>
                                    <Grid style={{display: 'contents'}}>
                                        <Cell size={12} offset={mediaClass == '' ? 0 : 3}>
                                    <div className={'md-display-3'} style={h3Style}>Join <i style={{fontWeight: '200'}}># {activeChannel}</i> to view messages </div>
                                    </Cell>
                                    </Grid>
                                    <div style={divStyle}>
                                        <Channel key={activeChannel.channel_name} mediaClass={mediaClass} user={user} channelAccess={channelAccess} 
                                                channel={activeChannel} joinCallback={(channel_name) => this.onJoinChannel(channel_name)} leaveCallback={() => this.onLeaveChannel()}
                                                endpoint={window.location.href+activeChannel.channel_name+'/messages?page='} />
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