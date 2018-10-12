import React, {Component} from "react";
import PropTypes from "prop-types";
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const Timestamp = require('react-timestamp');

const styles = theme => ({
    paper: {
      margin: theme.spacing.unit,
      padding: theme.spacing.unit * 2,
    },
  });

class Message extends Component{
    static propTypes = {
        data: PropTypes.object.isRequired
    };

    render(){
        return(
        <Grid item xs={8}>
            <Paper className={styles.paper}>
                <Grid container wrap="nowrap" spacing={16}>
                <Grid item>
                    <Avatar>W</Avatar>
                    <Typography>{this.props.data.user}</Typography>
                </Grid>
                <Grid item xs>
                    <Typography>{this.props.data.message}</Typography>
                    <Timestamp time={this.props.data.timestamp} precision={2} />
                </Grid>
                </Grid>
            </Paper>
        </Grid>
        );
    }
}


export default withStyles(styles)(Message);