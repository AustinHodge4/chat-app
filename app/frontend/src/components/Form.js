import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import './global.js';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing.unit,
      },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    dense: {
      marginTop: 16,
    },
    menu: {
      width: 200,
    },
  });

class Form extends Component {
  static propTypes = {
    callback: PropTypes.func
  };
  constructor(props){
    super(props);
  this.state = {
    name: "Austin",
    message: ""
  };
}
  onClick = () => {
    this.props.callback();
  }
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value});
  };
  handleSubmit = e => {
    e.preventDefault();
    const { name, message } = this.state;
    this.setState({'message': ''});
    const message_data = { name, message };
    chat_socket.send(JSON.stringify(message_data));
    
  };
  render() {
    const { name, message } = this.state;

    return (
      <Grid container spacing={24}>
      <Grid item xs>
        <form onSubmit={this.handleSubmit}>
        <input type="hidden" name="name" value={this.state.name}/>
        <TextField
          id="outlined-bare"
          className={styles.textField}
          margin="normal"
          variant="outlined"
          onChange={this.handleChange}
          value={this.state.message}
          name="message"
          multiline
          required
        />
        <Button type="submit" variant="outlined" color="primary" className={styles.button}>
        Send
      </Button>
      <Button onClick={this.onClick} variant="outlined" color="primary" className={styles.button}>
        More
      </Button>
          
        </form>
        </Grid>
        </Grid>
    );
  }
}
export default withStyles(styles)(Form);