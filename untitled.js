import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Picker, Switch, Button, Modal } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreator';
import { Rating, AirbnbRating } from 'react-native-elements';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId))
});

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return(
            <Card
              featuredTitle={dish.name}
              image={{ uri: baseUrl + dish.image }}
              >
              <Text style={{margin: 10}}>
                  {dish.description}
              </Text>
              <Icon
                raised
                reverse
                name={ props.favorite ? 'heart' : 'heart-o'}
                type='font-awesome'
                color='#f50'
                onPress={() => props.favorite ? console.log('Already favorite') : props.onPress() }
                />
            </Card>

      );
  }
  else {
    return(<View></View>)
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentsItem = ({ item, index }) => {
    return(
      <View key={index} style={{margin: 10}}>
        <Text style={{fontSize: 14}}>{item.comment}</Text>
        <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
        <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
      </View>
    );
  }

  return(
     <Card title="Comments">
       <FlatList
         data={comments}
         renderItem={renderCommentsItem}
         keyExtractor={item => item.id.toString()} />
     </Card>
  );
}



function RenderModal(props) {
  <Button></Button>

  return(
    <Modal
             animationType={'slide'}
             transparent={false}
             visible={this.state.showModal}
             onDismiss={() => {this.toggleModal(); this.resetForm()}}
             onRequestClose={() => {this.toggleModal(); this.resetForm()}}
             >
             <View>
               <Text style={styles.modalTitle}>Your Reservation</Text>
                 ratingCompleted(rating) {
                 console.log("Rating is: " + rating)
              }
              <AirbnbRating />
              <AirbnbRating
               count={5}
                  reviews={["1/5", "2/5", "3/5", "4/5", "5/5"]}
                 defaultRating={1}
                  size={20}
                />
                <Rating
                showRating
                 onFinishRating={this.ratingCompleted}
                 style={{ paddingVertical: 10 }}
                  />
                <Input
                 placeholder='INPUT WITH CUSTOM ICON'
                 leftIcon={
                       <Icon
                       name='user'
                       size={24}
                       color='black'
                       />  
                           }
                />
               <Button
                  onPress={() => {this.toggleModal(); this.resetForm()}}
                  color='#512DA8'
                  title='Close'
                 />
             </View>
      </Modal>
  );
}




class Dishdetail extends Component{


   constructor(props) {
     super(props);
      this.state = {
        rating:'4',
        author:'',
        date: '',
        showModal: false
      }
   }

   toggleModal() {
    this.setState({ showModal: !this.state.showModal})
   }

   handleReservation() {
    console.log(JSON.stringify(this.state)); 
     this.toggleModal();
   }

   resetForm(){
    this.setState({
      guests: 1,
      smoking: false,
      date: ''
    });
   }

   


  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  static navigationOptions = {
    title: 'Dish Details'
  };

  render() {
    const dishId = this.props.navigation.getParam('dishId','');

    return(
    <ScrollView>
       <RenderDish dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
        /> 
      <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} /> 
     </ScrollView>
     );
       
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);








import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreator';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId))
});

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return(
            <Card
              featuredTitle={dish.name}
              image={{ uri: baseUrl + dish.image }}
              >
              <Text style={{margin: 10}}>
                  {dish.description}
              </Text>
              <Icon
                raised
                reverse
                name={ props.favorite ? 'heart' : 'heart-o'}
                type='font-awesome'
                color='#f50'
                onPress={() => props.favorite ? console.log('Already favorite') : props.onPress() }
                />
            </Card>

      );
  }
  else {
    return(<View></View>)
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentsItem = ({ item, index }) => {
    return(
      <View key={index} style={{margin: 10}}>
        <Text style={{fontSize: 14}}>{item.comment}</Text>
        <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
        <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
      </View>
    );
  }

  return(
     <Card title="Comments">
       <FlatList
         data={comments}
         renderItem={renderCommentsItem}
         keyExtractor={item => item.id.toString()} />
     </Card>
  );
}



class Dishdetail extends Component{   


  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  static navigationOptions = {
    title: 'Dish Details'
  };

  render() {
    const dishId = this.props.navigation.getParam('dishId','');

    return(
    <ScrollView>
       <RenderDish dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
        /> 
      <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} /> 
     </ScrollView>
     );
       
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);