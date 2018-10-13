import React, {Component} from "react";
import PropTypes from "prop-types";
import {IconSeparator, Cell, Avatar, Grid} from 'react-md';

const Timestamp = require('react-timestamp');

class Message extends Component{
    static propTypes = {
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
            letterSpacing: '0'
        }
        const Item = () => (
            <Grid style={gridStyle} noSpacing={true}>
                <Cell align={'top'} size={12}><div className="md-title md-font-bold" style={nameStyle}>{this.props.data.user}</div><Timestamp className="md-font-light" time={this.props.data.timestamp} precision={2} /></Cell>
                <Cell size={12} align={'top'}>{this.props.data.message}</Cell>
            </Grid>
        );
        return(
            <Grid>
                <Avatar random>O</Avatar>
                <Cell style={cellStyle} size={11}>
                    <Item />
                </Cell>
            </Grid>
        );
    }
}


export default Message;