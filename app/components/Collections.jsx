import React from 'react';
import CollectionItem from './CollectionItem.jsx';
import CollectionInput from './CollectionInput';
import Firebase from 'firebase';
import _ from 'lodash';
import Card from 'material-ui/lib/card/card';
import List from 'material-ui/lib/lists/list';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';

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
    this.onRequestChange = this.onRequestChange.bind(this);
  }

  updateItem(ref, key, input){
    let newRef = new Firebase(`${ref}/${key}`);
    newRef.set({name: input});
  }

  onRequestChange(){
    this.props.onRequestChange();
  }

  render(){
    let that = this;
    let listNodes = _.values(this.state.lists).map((list)=> {
      return (
        <CollectionItem
          fbRef={that.baseRef}
          key={list.key}
          list={list}
          selectList={that.props.selectList}
          updateItem={that.updateItem}
          handleClose={that.props.handleClose} />
      );
    });

    return (
      <div>
        <LeftNav
        open={this.props.open}
        docked={false}
        width={275}
        onRequestChange={this.onRequestChange.bind(this)} >
          <CollectionInput />
          <div>{listNodes}</div>
        </LeftNav>
      </div>
    );
  }
};
