import React, {Component} from "react";
import PropTypes from "prop-types";
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';

class TimestampMessage extends Component{
    static propTypes = {
        mobile: PropTypes.bool.isRequired,
        data: PropTypes.object.isRequired
    };
    
    render(){
        const gridStyle = {
            wordBreak: 'break-word',
        }
        const cellStyle = {
            margin: '0',
            width: '100%'
        }
        
        const messageBox = {
            marginLeft: 'initial',
            marginRight: 'initial',
            width: '100%'
        }
        const seperator = {
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            fontSize: '14px',
            // color: '#72767d'
        }
        
        return(
            <Grid style={messageBox}>
                <Cell style={cellStyle} size={12}>
                    <Grid style={gridStyle} noSpacing={true}>
                        <Cell align={'top'} size={12}>
                            <div style={seperator} className="md-font-light">
                                <div style={{content: '', flex: '1',  borderBottom: '1px solid #3f51b575', marginRight: '.25em'}} ></div>
                                {this.props.data.value}
                                <div style={{content: '', flex: '1',  borderBottom: '1px solid #3f51b575', marginLeft: '.25em'}} ></div>
                            </div>
                        </Cell>
                    </Grid>
                </Cell>
            </Grid>
        );
    }
}


export default TimestampMessage;