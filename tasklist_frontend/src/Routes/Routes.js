import React from 'react'
import { Switch,Route } from 'react-router-dom'
import Login from '../Components/Login'
import Register from '../Components/Register'
import Dashboard from '../Components/Dashboard'

export default function Routes() {
    return (
        <div>
            <Switch>
                <Route exact path='/' render = {(props) => <Login  {...props}/>} />
                <Route exact path='/register' render = {(props) => <Register {...props} />} />
                <Route exact path='/dashboard' render = {(props) => <Dashboard {...props} />} />
            </Switch>
        </div>
    )
}
