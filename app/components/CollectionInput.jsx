import React from 'react';
import Card from 'material-ui/lib/card/card';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Firebase from 'firebase';

export default class CollectionInput extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      title: ''
    }
    this.firebaseRef = new Firebase('https://gaslightchallenge.firebaseio.com');
  }

  onChange(e){
    this.setState({
      title: e.target.value
    });
  }

  onKeyUp(e){
    if(e.keyCode === 13 && e.target.value != ''){
      e.preventDefault();

      this.firebaseRef.push({
        name: this.state.title
      });

      this.setState({
        title: ''
      });
    }
  }

  render(){
    return (
      <Card>
        <TextField
          value={this.state.title}
          onChange={this.onChange.bind(this)}
          onKeyUp={this.onKeyUp.bind(this)}
          placeholder='New List Name, hit enter to submit'
          style={{
            width: '92%',
            marginLeft: '4%',
            marginRight: '4%',
            borderColor: '#D0D0D0',
            borderRadius: 3,
            minHeight: 30,
            color: '#555',
            fontSize: 16
          }} />
      </Card>
    )
  }
}
