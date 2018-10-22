 import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Card, CardTitle, CardText, CardActions, Button, TextField, FontIcon, Grid, Cell} from 'react-md';
// class Login extends Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             isLoading: true,
//         }

//     }
    
    
    
    
//     componentDidMount() {
//     }
//     render() {
//         const {isLoading} = this.state;
//         const Item = ({ label, children }) => (
//             <IconSeparator label={label} iconBefore component="li" className="md-cell md-cell--12">
//               {children}
//             </IconSeparator>
//           );
//         return (
//             isLoading == false ? null : (
//                 <ul className="md-list-unstyled md-grid avatars__examples">
    
//     <Item label="An Avatar with a FontAwesome icon is been looked for.">
//       <Avatar icon={<FontIcon iconClassName="fa fa-rocket" />} />
//     </Item>
    
//     <Item label="An Avatar using a letter and the default color.">
//       <Avatar>M</Avatar>
//     </Item>
//     <Item label="An Avatar using a letter and a random color?.">
//       <Avatar random>O</Avatar>
//     </Item>
//   </ul>
//             )
            
//           );
//     }
// }
// const wrapper = document.getElementById("app");
// wrapper ? ReactDOM.render(<Login />, wrapper) : null;
// export default Login; 


class Login extends Component {
  constructor(props){
    super(props);
    this.state={
    username:'',
    password:'',
    isLoading: true
    }
   }
  handleChange(value, e, type){
    this.setState({[type]: value});
  };
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
    const {isLoading} = this.state;
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
                  <Button raised primary>Register</Button>
                </CardActions>
              </Card>
              </form>
            </Cell>
          </Grid>
        )
      );
    }
  }
 

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<Login />, wrapper) : null;


