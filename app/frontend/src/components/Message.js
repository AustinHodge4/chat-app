import React, {Component} from "react";
import PropTypes from "prop-types";
import {Cell, Avatar, Grid} from 'react-md';
import {Twemoji} from 'react-emoji-render';
const Timestamp = require('react-timestamp');

class Message extends Component{
    static propTypes = {
        mobile: PropTypes.bool.isRequired,
        data: PropTypes.object.isRequired
    };
    
    render(){
        const gridStyle = {
            wordBreak: 'break-word'
        }
        const cellStyle = {
            marginTop: '0',
            marginLeft: '16px'
        }
        const nameStyle = {
            display: 'inline',
            marginRight: '8px',
            letterSpacing: '0',
            fontSize: '24px'
        }
        const messageBox = {
            marginLeft: 'initial',
            marginRight: 'initial',
            width: '100%'
        }
        const Item = () => (
            <Grid style={gridStyle} noSpacing={true}>
            
                <Cell align={'top'} size={12}><div className="md-title md-font-bold" style={nameStyle}>{this.props.data.user}</div><Timestamp className="md-font-light" time={this.props.data.timestamp} precision={2} /></Cell>
                <Cell size={12} align={'top'} style={{fontSize: 'large'}}><Twemoji text={this.props.data.message} /></Cell>
            </Grid>
        );
        return(
            <Grid style={messageBox}>
                <Avatar style={{float: 'left', border: 'none', width: '52px', height: '52px', borderRadius: '10%'}} src={'http://i.pravatar.cc/150?u='+this.props.data.user+'@pravatar.com'} />
                <Cell style={cellStyle} size={this.props.mobile ? 3 : 11}>
                    <Item />
                </Cell>
            </Grid>
        );
    }
}


export default Message;