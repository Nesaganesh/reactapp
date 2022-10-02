import React, {Component } from 'react'
import { Link } from 'react-router-dom';
import './DiwaliSports.css';
import emailjs from 'emailjs-com';

class DiwaliSports extends Component {
  
    constructor(props) {
       super(props)

        this.state = {
          challenge: "",
          fullName: "",
          emailid: "",
          phone: "",
          gender: "",
          teamnames: "",
          diwaliReg: ""
        }
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    fullnamehandler = (event) => {
        this.setState({
            fullName: event.target.value
        })
    }
    emailidhandler = (event) => {
        this.setState({
            emaildid: event.target.value
        })
    }
    phonehandler = (event) => {
        this.setState({
            phone: event.target.value
        })
    }

    genderhandler = (event) => {
        this.setState({
            gender: event.target.value
        })
    }

    handleChange = (event) => {
      this.setState({sport: event.target.value})

      if(event.target.value === 'individual') {
        this.setState({challenge: 'cricket'})
      }

      if(event.target.value === 'team') {
        this.setState({challenge: 'badmiton'})
      }
    }

    handleSubmit = (event) => {
        alert(` Registered Successfully !!!!`)
        
        console.log(this.state);
        event.preventDefault();

        emailjs.sendForm('service_h6in7wb', 'template_hu6e9hm', event.target, 'WUNJawiU6bdr4-wXs')
        .then((result) => {
            console.log(result);
        },
        (error) => {
            console.log(error);
        }).catch(err => console.log(err));

    }

    render() {
        return (
            <>
             
            <div>

                <form onSubmit={this.handleSubmit}>
                    <h1><u>Tornament for Mens and Womens</u></h1>
                    <label>Sport :</label><select id="di" defaultValue="Select Sport" onChange={(e) => this.handleChange(e)}>
                        <option defaultValue>Select Sport</option>
                        <option value="cricket">Cricket</option>
                        <option value="badmiton">Badmiton</option>
                        <option value="caromboard">Caromboard</option>
                    </select><br />
                    <br />
                    <div className={this.state.sport}>
                      <label> Individual  </label>
                      <input id="individual" value="individual" name="challenge" type="radio" onChange={(e) => this.handleChange(e)} />
                      <label> Team  </label>
                      <input id="team" value="team" name="challenge" type="radio" onChange={(e) => this.handleChange(e)}/>
                    </div>
                    <br />
                    <br/>
                    <label>FullName :</label> <input type="text" value={this.state.fullname} name="fullname"  placeholder="FullName..." /><br /><br />
                    <label>Email Id :</label> <input type="text" value={this.state.emailid} name="emaiid"  placeholder="EmailId..." /><br /><br />
                    <label>Phone :</label> <input type="password" value={this.state.phone} name="phone"  placeholder="Phone..." /><br /><br />
                    <label>Gender :</label>
                    <select name="gender" defaultValue="Select Gender">
                        <option defaultValue>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select><br /><br />
                    <div className={this.state.challenge}> 
                    <label>Team Names :</label><br/>
                    <textarea name='teamnames' rows="15" cols="50"></textarea>
                    </div><br/><br />
                    <label>Are you registerted in Diwali Nov 2022  </label>
                    <input type="checkbox" id="diwaliReg" name="diwaliReg" value="Yes"></input>  <Link to='/diwali'>  (Diwali 2022 !!!!) </Link>
                    
                    <br /><br /> 
                    <input type="submit" value="Submit" />
                    <br/><br/><br/>
                    
                </form>

            </div>
            </>
        )
    }
}

export default DiwaliSports