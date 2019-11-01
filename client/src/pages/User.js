import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getUserProfileData } from '../redux/actions/dataActions';

import { connect } from 'react-redux'
import axios from 'axios';

class User extends Component {
      
    state = {
          profile: null
    }
      componentWillMount(){
            const handle = this.props.match.param.handle;
            this.props.getUserProfileData(handle)
            axios.get(`/user/${handle}`)
            .then(res => {
                  this.setState({profile: res.data.user})
            })
            .catch(error => console.log(error))
      }

    
      render(){
            const {screams, loading}= this.props.data
            return (
            <div>
                  
            </div>
      )
    }
}

User.propTypes = {
      getUserProfileData: PropTypes.func.isRequired,
      data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
      data: state.data
})

export default connect(mapStateToProps,{getUserProfileData})(User)

