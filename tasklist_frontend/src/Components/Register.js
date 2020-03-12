import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default class Register extends Component {
    constructor(props){
        super(props)
        this.state = {
            username:'',
            password:'',
            helpText:''
        }
    }

    handleChange = e =>{
        this.setState({
            [e.target.id] : e.target.value,
            helpText:""
        })
    }

    handleSubmit = e =>{
        e.preventDefault()
        let newUser = {
            username : this.state.username,
            password: this.state.password
        }

        axios.post('http://127.0.0.1:5000/auth/register',newUser)
        .then(res =>this.setState({
            helpText:res.data.message
        }))
        .catch(err => console.log(err))
    }

    render(){
        return (
            <div className="container my-5">
                <h2 className='text-center'>TASK LIST MANAGER</h2>
                <form onSubmit={this.handleSubmit} className='mx-auto bg-light w-50 border shadow-sm p-5'>
                    <h5>Register:</h5>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" onChange={this.handleChange} value={this.state.username} className="form-control" id="username" aria-describedby="emailHelp" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passoword">Password</label>
                        <input type="password" onChange={this.handleChange} value={this.state.password} className="form-control" id="password" />
                    </div>
                   
                    <button type="submit" className="btn btn-primary">Register</button>
                    {this.state.helpText && <div>{this.state.helpText}</div>}
                    <div className='mt-3'><Link to='/'>Login</Link></div>
                </form>
            </div>
        )
    }
}
