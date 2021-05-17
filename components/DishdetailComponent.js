import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, StyleSheet, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreator';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props) {
    const dish = props.dish;
    let viewRef;
    const handleViewRef = ref => viewRef = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    }

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if (dx > 200)
            return true;
        else
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            viewRef.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        },
                        {
                            text: 'OK',
                            onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}
                        }
                    ],
                    { cancelable: false }
                );
            }

            if (recognizeComment(gestureState)) {
                props.modalToggle();
            }

            return true;
        }
    });

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        });
    }

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={handleViewRef}
                {...panResponder.panHandlers}
            >
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}
                >
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={styles.btnRow}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite!') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.modalToggle()}
                        />
                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    } else {
        return(<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating imageSize={10} readonly startingValue={item.rating} style={{marginRight: 'auto'}} />
                <Text style={{fontSize: 12}}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    }

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 5,
            author: '',
            comment: '',
            showModal: false
        }
    }

    resetModal () {
        this.setState({
            rating: 5,
            author: '',
            comment: '',
            showModal: false
        });
    }

    toggleModal () {
        this.setState({showModal: !this.state.showModal});
    }

    markFavorite (dishId) {
        this.props.postFavorite(dishId);
    }

    handleComment (dishId) {
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.resetModal();
    }

    render() {
        const dishId = this.props.route.params.dishId;

        return(
            <ScrollView>
                <RenderDish
                    dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    modalToggle={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter(comment => comment.dishId === dishId)} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            onFinishRating={(value) => this.setState({rating: value})}
                            startingValue={this.state.rating}
                            minValue={1}
                        />
                        <Input
                            placeholder='Author'
                            leftIcon={{type: 'font-awesome', name: 'user-o'}}
                            onChangeText={value => this.setState({ author: value })}
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon={{type: 'font-awesome', name: 'comment-o'}}
                            onChangeText={value => this.setState({ comment: value })}
                        />
                        <Button
                            title='SUBMIT'
                            color='#512DA8'
                            onPress={() => this.handleComment(dishId)}
                        />
                        <Text />
                        <Button
                            title='CANCEL'
                            color='#808080'
                            onPress={() => this.resetModal()}
                        />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);