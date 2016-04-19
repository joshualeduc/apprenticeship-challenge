import React from 'react';
import GList from './GList.jsx';
import Firebase from 'firebase';
import _ from 'lodash';
import Card from 'material-ui/lib/card/card';
import List from 'material-ui/lib/lists/list';

export default class AllLists extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lists: {}
    };
    this.baseRef = 'https://gaslightchallenge.firebaseio.com/'
    this.firebaseRef = new Firebase(this.baseRef);
    //read list from firebase
    this.firebaseRef.on("child_added", (item)=> {
      let itemVal = item.val();
      itemVal.key = item.key();
      this.state.lists[itemVal.key] = itemVal;
      this.setState({lists: this.state.lists});
    });
    //check for removed item in firebase
    this.firebaseRef.on("child_removed", (item)=> {
      let key = item.key();
      delete this.state.lists[key];
      this.setState({lists: this.state.lists});
    });
    //check for changed item in firebase
    this.firebaseRef.on('child_changed', (item)=> {
      let itemVal = item.val();
      itemVal.key = item.key();
      this.state.lists[itemVal.key] = itemVal;
      this.setState({lists: this.state.lists});
    });

    //extra binding to use with es6 classes
    this.updateItem = this.updateItem.bind(this);
  }

  updateItem(ref, key){

  }

  render(){
    let that = this;
    let listNodes = _.values(this.state.lists).map((list)=> {
      return (
        <GList
          fbRef={that.baseRef}
          key={list.key}
          list={list}
          updateItem={that.updateItem} />
      );
    });

    return (
      <div>
        <Card>
          <List>{listNodes}</List>
        </Card>
      </div>
    );
  }
};