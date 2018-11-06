 import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Card, CardTitle, CardText, CardActions, Toolbar, Divider, Button, TextField, FontIcon, Grid, DialogContainer, Cell} from 'react-md';


class Login extends Component {
  constructor(props){
    super(props);
    this.state={
    username:'',
    password:'',
    first_name:'',
    last_name:'',
    email:'',
    showCreateUserDialog: false,
    isLoading: true
    }
   }
  handleChange(value, e, type){
    this.setState({[type]: value});
  };
  onCloseCreateUserDialog(e){
    this.setState({showCreateUserDialog: false});
  }
  onOpenCreateUserDialog(e){
    this.setState({showCreateUserDialog: true});
  }
  handleSubmit = e => {
    e.preventDefault();
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
    const {username, password} = this.state;
    if(/\S/.test(username) && /\S/.test(password)){  
      let payload = {username: this.state.username, password: this.state.password}  
      fetch(window.location.href, {
        method: 'POST',
        headers: {
            "X-CSRFToken": get_cookie('csrftoken'),
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }).then(response => {
          if (response.status !== 200) {
              return this.setState({ placeholder: "Fail to login" });
          }
          return response.json();
      })
      .then(data => {
          console.log(data);
          if(data.success){
              window.location.href = '../api';
          } else {
            console.log(data.error_message);      
          }
      });
    }
  };
  render() {
    const {isLoading, showCreateUserDialog} = this.state;
    const card_title_style = {
      textAlign: 'center',
     };

      return (
        isLoading == false ? null : (
          <Grid className="grid-example">
            <Cell size={12} tabletSize={6} tabletOffset={1} desktopOffset={3} desktopSize={6}>
            <form onSubmit={this.handleSubmit}>
              <Card className="md-block-centered">
                <CardTitle title="Welcome to Chat-app" subtitle="Login or Register" />
                <CardText>
                <TextField
                    id="username"
                    label="username"
                    type="text"
                    leftIcon={<FontIcon>account_box</FontIcon>}
                    required
                    autoComplete={'username'}
                    onChange={(value, e) => this.handleChange(value, e, 'username')}
                  />
                  <TextField
                    id="password"
                    label="password"
                    type="password"
                    leftIcon={<FontIcon>lock</FontIcon>}
                    required
                    autoComplete={'current-password'}
                    onChange={(value, e) => this.handleChange(value, e, 'password')}
                  />
                </CardText>
                <CardActions>
                  <Button type="submit" raised primary style={{marginRight: '32px'}}>Login</Button>
                  <Button raised primary onClick={(e) => this.onOpenCreateUserDialog(e)}>Register</Button>
                </CardActions>
              </Card>
              </form>
              <DialogContainer
                id="create_channel_dialog"
                visible={showCreateUserDialog}
                onHide={(e) => {(this.onCloseCreateUserDialog(e))}}
                title="Register"
                fullPage
            >
            <Toolbar
              fixed
              colored
              title="New User Registeration"
              titleId="simple-full-page-dialog-title"
              nav={<Button icon onClick={(e) => this.onCloseCreateUserDialog(e)}>close</Button>}
              actions={<Button type="submit" primary  flat onClick={this.hide}>Register</Button>}
            />
                <section className="md-toolbar-relative" style={{paddingLeft: '32px', paddingRight: '32px'}}>
                <form onSubmit={this.handleSubmit}>
                <TextField
                    id="user_name"
                    label="Username"
                    type="text"
                    leftIcon={<FontIcon>account_box</FontIcon>}
                    required
                    onChange={(value, e) => this.handleChange(value, e, 'username')}
                  />
             <TextField
                    id="firstname"
                    label="First Name"
                    type="text"
                    leftIcon={<FontIcon>account_box</FontIcon>}
                    required
                    onChange={(value, e) => this.handleChange(value, e, 'first_name')}
                  />
                  <TextField
                    id="lastname"
                    label="Last Name"
                    type="text"
                    leftIcon={<FontIcon>lock</FontIcon>}
                    required
                    onChange={(value, e) => this.handleChange(value, e, 'last_name')}
                  />
           <br/>
           <TextField
                    id="email"
                    label="Email Address"
                    type="email"
                    leftIcon={<FontIcon>account_box</FontIcon>}
                    required
                    onChange={(value, e) => this.handleChange(value, e, 'email')}
                  />
                  <TextField
                    id="password_2 s"
                    label="Password"
                    type="password"
                    leftIcon={<FontIcon>lock</FontIcon>}
                    required
                    onChange={(value, e) => this.handleChange(value, e, 'password')}
                  />
           
              </form>
              </section>
            </DialogContainer>
            </Cell>
          </Grid>
        )
      );
    }
  }
 

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Login />, wrapper) : null;


