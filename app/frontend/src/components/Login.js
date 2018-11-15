 import React, { Component } from "react";
import ReactDOM from "react-dom";

import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';
import CardActions from 'react-md/lib/Cards/CardActions';
import Grid from 'react-md/lib/Grids/Grid';
import Cell from 'react-md/lib/Grids/Cell';
import Toolbar from 'react-md/lib/Toolbars/Toolbar';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields/TextField';
import FontIcon from 'react-md/lib/FontIcons/FontIcon';
import DialogContainer from 'react-md/lib/Dialogs/DialogContainer';
import Snackbar from 'react-md/lib/Snackbars/Snackbar';


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
    toasts: [],
    autoHide: true,
    isLoading: true
    }
   }
  handleChange(e, type, value){
    this.setState({[type]: value});
  };
  onCloseCreateUserDialog(e){
    this.setState({showCreateUserDialog: false, username: '', password: ''});
  }
  onOpenCreateUserDialog(e){
    this.setState({showCreateUserDialog: true, username: '', password: '', first_name: '', last_name: '', email: ''});
  }
  addToast = (text, autohide = true) => {
    this.setState((state) => {
      const toasts = state.toasts.slice();
      toasts.push({ text });
      return { toasts, autohide };
    });
  };
  dismissToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  };


  handleSubmit = (e, type) => {
    e.preventDefault();

    this.setState(prev => ({username: prev.username.trim(), password: prev.password.trim(),
      first_name: prev.first_name.trim(),last_name: prev.last_name.trim(),email: prev.email.trim()}), 
      ()=> {

      const {username, password, first_name, last_name, email} = this.state;
      if(type == 'login'){
        let login_form = document.getElementById("login_form");
        if(login_form.checkValidity()) {
          let payload = {type: type, username: username, password: password} 
          
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
                  this.addToast('Unexpected fail to login');
                  return null;
              }
              return response.json();
          })
          .then(data => {
              if(data.success){
                  window.location.href = '../api';
              } else {
                this.addToast(data.error_message);     
              }
          });
        }
        else {
          login_form.reportValidity();
        }
      }
      else if(type == 'register'){
        let register_form = document.getElementById("register_form");
        if(register_form.checkValidity()) {
          let payload = {type: type, username: username, password: password, 
            first_name: first_name, last_name: last_name, email: email};

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
                this.addToast('Unexpected fail to register');
                return null;
              }
              return response.json();
          })
          .then(data => {
              if(data.success){
                this.setState({showCreateUserDialog: false});
                this.addToast('Account Created!');
              } else {
                this.addToast(data.error_message);      
              }
          });
        }
        else {
            register_form.reportValidity();
        }
          
      }
    });
  };
  render() {
    const {isLoading, showCreateUserDialog, toasts, autohide} = this.state;

      return (
        isLoading == false ? null : (
          <Grid>
            <Cell size={12} tabletSize={6} tabletOffset={1} desktopOffset={3} desktopSize={6}>
            <form id="login_form" onSubmit={(e) => this.handleSubmit(e, 'login')}>
              <Card className="md-block-centered">
                <CardTitle title="Let's Talk About It" subtitle="Login or Register" />
                <CardText>
                <TextField
                    id="username"
                    label="username"
                    type="text"
                    leftIcon={<FontIcon>account_box</FontIcon>}
                    required
                    value={this.state.username}
                    autoComplete={'username'}
                    onChange={(value, e) => this.handleChange(e, 'username', value)}
                  />
                  <TextField
                    id="password"
                    label="password"
                    type="password"
                    leftIcon={<FontIcon>lock</FontIcon>}
                    required
                    value={this.state.password}
                    autoComplete={'current-password'}
                    onChange={(value, e) => this.handleChange(e, 'password', value)}
                  />
                </CardText>
                <CardActions>
                  <Button type="submit" raised primary style={{marginRight: '32px'}}>Login</Button>
                  <Button raised primary onClick={(e) => this.onOpenCreateUserDialog(e)}>Register</Button>
                </CardActions>
              </Card>
              </form>
              <Snackbar
              id="response-snackbar"
              toasts={toasts}
              autohide={autohide}
              onDismiss={this.dismissToast}
            />
              <DialogContainer
                id="register_dialog"
                visible={showCreateUserDialog}
                onHide={(e) => {(this.onCloseCreateUserDialog(e))}}
                aria-labelledby="register-toolbar"
                fullPage
            >
            <Toolbar
              fixed
              colored
              title="New User Registeration"
              titleId="register-toolbar"
              nav={<Button icon onClick={(e) => this.onCloseCreateUserDialog(e)}>close</Button>}
              actions={<Button type="submit" primary  flat onClick={(e) => this.handleSubmit(e, 'register')}>Register</Button>}
            />
                <section className="md-toolbar-relative" style={{paddingLeft: '32px', paddingRight: '32px'}}>
                <form id="register_form">
                <TextField
                    id="register_username"
                    label="Username"
                    type="text"
                    leftIcon={<FontIcon>account_box</FontIcon>}
                    required
                    value={this.state.username}
                    onChange={(value, e) => this.handleChange(e, 'username', value)}
                  />
             <TextField
                    id="first_name"
                    label="First Name"
                    type="text"
                    leftIcon={<FontIcon>account_box</FontIcon>}
                    required
                    value={this.state.first_name}
                    onChange={(value, e) => this.handleChange(e, 'first_name', value)}
                  />
                  <TextField
                    id="last_name"
                    label="Last Name"
                    type="text"
                    leftIcon={<FontIcon>lock</FontIcon>}
                    required
                    value={this.state.last_name}
                    onChange={(value, e) => this.handleChange(e, 'last_name', value)}
                  />
           <br/>
           <TextField
                    id="email"
                    label="Email Address"
                    type="email"
                    leftIcon={<FontIcon>account_box</FontIcon>}
                    required
                    value={this.state.email}
                    onChange={(value, e) => this.handleChange(e, 'email', value)}
                  />
                  <TextField
                    id="register_password"
                    label="Password"
                    type="password"
                    leftIcon={<FontIcon>lock</FontIcon>}
                    required
                    value={this.state.password}
                    onChange={(value, e) => this.handleChange(e, 'password', value)}
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


