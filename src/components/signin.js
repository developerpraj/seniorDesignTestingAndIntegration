import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Fade  } from 'reactstrap';
import _ from 'lodash';
import ReactLoginMS from "react-ms-login";


const logo = require('./logo.png'); 
const lo = require('./o365.png'); 
const validationMethods =  {
    required : (field, value) => {
        if (!value.toString().trim().length) {
            return  `This ${field} field is required.`
        }
    },
    isEmail: (field,value) => {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(value) === false) {
            return  `Invalid Email Address.`
        }        
    }
} 
 
const validateForm = (form) => {
    const loginForm = document.getElementById(form)
     return loginForm.querySelectorAll('[validations]');
}
 
const runValidationRules  = (element, errors) => {
    const target = element;
    const field =  target.name;
    const value = target.value
    let validations =  element.getAttribute('validations');
    validations =  validations.split(',')
 
    for (let validation of validations) {
        validation = validation.split(':');
        const rule = validation[0];
        const error = validationMethods[rule](field, value);
        errors[field] = errors[field] || {};
        if(error) {
            errors[field][rule] = error;
        } else {
            if(_.isEmpty(errors[field])) {
                delete errors[field];
            } else {
                delete errors[field][rule];
            }
        }
    }
 
    return errors;
}


class ButtonContent extends React.Component {
    render(){
        return (
        <span>
            Login with O365
        </span>)
    }
}
 
export default class Login extends Component {
 
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: []
        }
    }
 
 
 
    login = (event) => {
 
        event.preventDefault();
 
        const formElements = validateForm("loginForm");
 
        formElements.forEach(element=> {
           const errors = runValidationRules(element, this.state.errors);
            this.setState({
                errors: errors
            });
        })
 
        const email = this.state.email;
        const password = this.state.password;
        const errors =  this.state.errors;
        console.log(email, password, errors);
    }
 
    handleChange = (event) => {
        const target = event.target;
        const field =  target.name;
        const value = target.value
 
        const errors = runValidationRules(target, this.state.errors);
 
        this.setState({
            errors: errors
        });
 
        this.setState({
            [field]:  value
        });
    }
 
    render() {
        return (

            <div className="container">
                 <img src={logo} />
                <Form id="loginForm" method="post" onSubmit={this.login}>
                    <FormGroup>
                        <Label className="email"for="email">Email: </Label>
                        <Input
                            type="text"
                            validations ={['required','isEmail']}
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            id="email"
                            placeholder="Enter your email address."
                        />
                      <FromValidationError field={this.state.errors.email} />
                    </FormGroup>
                    <FormGroup>
                        <Label className="password" for="password">Password</Label>
                        <Input 
                            type="password"
                            validations={['required']}
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            id="password"
                            placeholder="Enter your password."
                        />
                        <FromValidationError field={this.state.errors.password} />
                    </FormGroup>
                    <ReactLoginMS
                         clientId="3e6f7b8a-c950-489f-af64-19b575aa4ca4" // required: 'application id/client id' obtained from https://apps.dev.microsoft.com for your app
                         redirectUri="http://localhost:3000/authorize" // required: redirectUri registered in https://apps.dev.microsoft.com for your app
                         scopes={["user.read"]} //optional: defaults to "user.read" full list is present https://developer.microsoft.com/en-us/graph/docs/concepts/permissions_reference
                         responseType="token" //optional: valid values are "token" for `Implicite OAuth flow` and "code" for `Authorization Code flow` defaults to "token"
                         cssClass="some-css-class" // optional: space separated class names which are applied on the html Button element
                         btnContent={ButtonContent} // optional: can be string or a valid react component which can be rendered inside html Button element
                         handleLogin={(data) => console.log(data)}// required: callback to receive token/code after successful login
                    />
                </Form>
            </div>
            
        );
    }
}
 
const FromValidationError = props => (
    <Fade in={Boolean(props.field)}  tag="p" className="error">
       { props.field ?  Object.values(props.field).shift() : '' } 
  </Fade>
);