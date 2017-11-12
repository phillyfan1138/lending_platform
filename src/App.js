import React from 'react'
import Login from './Components/Login'
import Payments from './Components/Payments'
import Application from './Components/Application'
import { CircularProgress } from 'material-ui/Progress'
import {connect} from 'react-redux'
import { isEmpty, isLoaded } from 'react-redux-firebase'
import {Switch, Redirect, Route} from 'react-router-dom'

export const App=({auth, match})=>(
    isLoaded(auth)?(isEmpty(auth)?<Login/>:(
        <Switch>
            <Redirect exact from='/' to='/payments'/>
            <Route path='/payments' component={Payments}/>
            <Route path='/application' component={Application}/>
        </Switch>
    )):<CircularProgress/>
)
//const mapStateToProps=({firebase})=>({auth:firebase.auth})
const mapStateToProps=state=>{
    console.log(state)
    return {auth:state.firebase.auth}
}
export default connect(mapStateToProps)(App)