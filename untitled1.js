import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import { Permissions, Notifications } from 'expo';

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date:''
        }
    }

    handleReservation() {
       Alert.alert(
            'Your Reservation OK?',
           'Number of Guests: ' + this.state.guests + '\nSmoking? ' + this.state.smoking + '\nDate and Time: ' + this.state.date,
            [
                {
                    text: 'Cancel',
                    onPress: () => this.resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        this.presentLocalNotification(this.state.date);
                        this.resetForm()
                    }
                }
            ],
            { cancelable: false }
        );

        console.log(JSON.stringify(this.state));
    }

    resetForm () {
        this.setState({
            guests: 1,
            smoking: false,
            date: ''
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS)
        if ( permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted'){
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
           title: 'Your Reservation',
           body: 'Reservation for ' + date + 'requested',
           ios: {
             sound: true
           },
           android: {
            sound: true,
            vibrate: true,
            color: '#512DA8'
           }
        });
    }

    render() {
        return(
            <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}
                    >
                        <Picker.Item label='1' value='1' />
                        <Picker.Item label='2' value='2' />
                        <Picker.Item label='3' value='3' />
                        <Picker.Item label='4' value='4' />
                        <Picker.Item label='5' value='5' />
                        <Picker.Item label='6' value='6' />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.smoking}
                        onTintColor='#512DA8'
                        onValueChange={(value) => this.setState({smoking: value})}
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <DatePicker
                        style={{flex: 2, marginRight: 20}}
                        date={this.state.date}
                        format=''
                        mode='datetime'
                        placeholder='select date and time'
                        minDate='2020-01-01'
                        confirmBtnText='Confirm'
                        cancelBtnText='Cancel'
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => {this.setState({date: date})}}
                    />
                </View>
                <View style={styles.formRow}>
                    <Button
                        title='Reserve'
                        color='#512DA8'
                        onPress={() => this.handleReservation()}
                        accessibilityLabel='Learn more about this purple button'
                    />
                </View>
            </Animatable.View>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    }
});

export default Reservation;





import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native'; 
import { Button, Icon, Input, CheckBox } from 'react-native-elements';
import { SecureStore, Permissions, ImagePicker, Asset, ImageManipulator } from 'expo';
import { createBottomTabNavigator } from 'react-navigation';
import { baseUrl } from '../shared/baseUrl';

class LoginTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false

        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo')
        .then((userdata) => {
            let userinfo = JSON.parse(userdata);
            if (userinfo) {
                this.setState({username: userinfo.username});
                this.setState({password: userinfo.password});
                this.setState({remember: true}); 
            }
        })
    }

    static navigationOptions = {
        title: 'Login',
        tabBarIcon: ({ tintColor }) => (
            <Icon
               name='sign-in'
               type='font-awesome'
               size={24}
               iconStyle={{ color: tintColor }} 
            />
        )
    };

    handleLogin() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) {
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({ username:this.state.username, password: this.state.password})
                )
            .catch((error) => console.log('could not save user info', error));
        }
        else {
            SecureStore.deleteItemAsync('userinfo')
              .catch((error) => console.log('could not delete user info', error));
        }
    }

    render() {
        return(
            <View style={styles.container}>
              <Input
                 placeholder="Username"
                 leftIcon={{ type: 'font-awesome',name: 'user-o'}}
                 onChangeText={(username) => this.setState({username})}
                 value={this.state.username}
                 containerStyle={styles.formInput}
                 />
                 <Input
                 placeholder="Password"
                 leftIcon={{ type: 'font-awesome',name: 'key'}}
                 onChangeText={(password) => this.setState({password})}
                 value={this.state.password}
                 containerStyle={styles.formInput}
                 />
                 <CheckBox
                    title="Remember Me"
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({remember: !this.setState.remember})}
                    containerStyle={styles.formCheckbox} 
                 />
                 <View style={styles.formButton} >
                     <Button 
                       onPress={() => this.handleLogin()}
                       title='Login'
                       icon={
                        <Icon 
                            name='sign-in' 
                            type='font-awesome'
                            size={24} 
                            color='white' 
                            /> 
                        }
                       buttonStyle={{ backgroundColor : '#512DA8' }}
                       />
                 </View>
                 <View style={styles.formButton}>
                     <Button 
                       onPress={() => this.props.navigation.navigate('Register') }
                       title='Register'
                       clear
                       icon={
                        <Icon 
                            name='user-plus' 
                            type='font-awesome'
                            size={24} 
                            color='blue' 
                            /> 
                        }
                       titleStyle={{ color: 'blue'}}
                       />
                 </View>
            </View>

            );
    }

}

class RegisterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl + 'images/logo.png'

        }
    }

    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4,3]
            });

            if (!capturedImage.cancelled) {
                this.processedImage(capturedImage.uri);
            }
        }
    }

    processImage = async (imageUri) => {
        let processedImage = await ImageManipulator.manipulate(
               imageUri,
               [
                 { resize: { width: 400 }}
               ],
               { format: 'png'}
            );
        this.setState({ imageUrl: processedImage.uri })
    }


    static navigationOptions = {
        title: 'Register',
        tabBarIcon: ({ tintColor }) => (
            <Icon
               name='user-plus'
               type='font-awesome'
               size={24}
               iconStyle={{ color: tintColor }} 
            />
        )
    };

    handleRegister() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember)
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({ username:this.state.username, password: this.state.password})
                )
            .catch((error) => console.log('could not save user info', error));
    }


    render() {
        return(
            <ScrollView>
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                 <Image
                     source={{ uri: this.state.imageUrl }}
                     loadingIndicatorSource={require('./images/logo.png')}
                     style={styles.image}
                    />
                    <Button
                       title='Camera'
                       onPress={this.getImageFromCamera}
                        />
              </View>
              <Input
                 placeholder="Username"
                 leftIcon={{ type: 'font-awesome',name: 'user-o'}}
                 onChangeText={(username) => this.setState({username})}
                 value={this.state.username}
                 containerStyle={styles.formInput}
                 />
                 <Input
                 placeholder="Password"
                 leftIcon={{ type: 'font-awesome',name: 'key'}}
                 onChangeText={(password) => this.setState({password})}
                 value={this.state.password}
                 containerStyle={styles.formInput}
                 />
                 <Input
                 placeholder="First Name"
                 leftIcon={{ type: 'font-awesome',name: 'user-o'}}
                 onChangeText={(firstname) => this.setState({firstname})}
                 value={this.state.firstname}
                 containerStyle={styles.formInput}
                 />
                 <Input
                 placeholder="Last Name"
                 leftIcon={{ type: 'font-awesome',name: 'user-o'}}
                 onChangeText={(lastname) => this.setState({lastname})}
                 value={this.state.lastname}
                 containerStyle={styles.formInput}
                 />
                 <Input
                 placeholder="Email"
                 leftIcon={{ type: 'font-awesome',name: 'envelop-o'}}
                 onChangeText={(email) => this.setState({email})}
                 value={this.state.email}
                 containerStyle={styles.formInput}
                 />
                 <CheckBox
                    title="Remember Me"
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({remember: !this.setState.remember})}
                    containerStyle={styles.formCheckbox} 
                 />
                 <View style={styles.formButton} >
                    <Button 
                       onPress={() => this.handleRegister()}
                       title='Register'
                       icon={
                        <Icon 
                            name='user-plus' 
                            type='font-awesome'
                            size={24} 
                            color='white' 
                            /> 
                        }
                       buttonStyle={{ backgroundColor : '#512DA8' }}
                       />
                 </View>
            </View>
            </ScrollView>

            );
    }
}

 const Login = createBottomTabNavigator({
    Login: LoginTab,
    Register: RegisterTab
 }, {
    tabBarOptions: {
        activeBackgroundColor: '#9575CD',
        inactiveBackgroundColor: '#D1C4E9',
        activeTintColor: 'white',
        inactiveTintColor: 'gray'

    }
 })

const styles = StyleSheet.create({
     container: {
        justifyContent: 'center',
        margin: 20
     },
     imageContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 20
     },
     image: {
        margin: 10,
        width: 80,
        height: 60
     },
     formInput: {
        margin: 20
     },
     formCheckbox: {
        margin: 20,
        backgroundColor: null
     },
     formButton: {
        margin: 60
     }
    });
export default Login;