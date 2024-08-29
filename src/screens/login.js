import React, { Component } from "react";
import { Image, AsyncStorage,TouchableHighlight  } from "react-native";
import {
  Container,
  Text,
  View,
  Button
} from "native-base";
import ContactsWrapper from 'react-native-contacts-wrapper';
import { Grid, Row } from "react-native-easy-grid";

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from 'react-native-google-signin';

import styles from '../config/styles';
const logo = require("../../assets/logo.png");
const redes = require("../../assets/redes.png");


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userInfo: '',
      error: null
    };
    this.onButtonPressed = this.onButtonPressed.bind(this);
  }

  async componentDidMount() {
    
    // this._configureGoogleSignIn();
    // await this._getCurrentUser();
  }

  // carregaInfo = async() => {
  //   let id = await AsyncStorage.getItem('userID');

  //   if(id!=""){
  //     this.props.navigation.navigate('Home')
      
  //   }
  // }

	  // willFocus = this.props.navigation.addListener(
    //   'willFocus',
    //   (payload) => {
    //     this.carregaInfo();
    //   }
	  // );

  // async _getCurrentUser() {
  //   try {
  //     const userInfo = await GoogleSignin.signInSilently();
  //     this.setState({ userInfo, error: null });
  //   } catch (error) {
  //     const errorMessage =
  //       error.code === statusCodes.SIGN_IN_REQUIRED ? 'Please sign in :)' : error.message;
  //     this.setState({
  //       error: new Error(errorMessage),
  //     });
  //   }
  // }


  // _configureGoogleSignIn() {
  //   GoogleSignin.configure({
  //     webClientId: '578275292959-19mc40jcgv8d40tqctc8pd81cm008qs8.apps.googleusercontent.com',
  //     offlineAccess: false,
  //   });
  // }
  // _signIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     this.setState({ userInfo, error: null });
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // sign in was cancelled
  //       Alert.alert('cancelled');
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation in progress already
  //       Alert.alert('in progress');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       Alert.alert('play services not available or outdated');
  //     } else {

  //       Alert.alert('Something went wrong', error.toString());
  //       console.log('Something went wrong', error.toString());
  //       this.setState({
  //         error,
  //       });
  //     }
  //   }
  // };

  onButtonPressed() {
    ContactsWrapper.getContact()
    .then((contact) => {
        // Replace this code
        alert(JSON.stringify(contact));
    })
    .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MESSAGE: ", error.message);
    });
}
  render() {
    return (
      <Container>



        <Grid>
          <Row style={{height: 200, backgroundColor: "#484848", justifyContent: 'center', alignItems: 'center'}}>
            
              <Image square style={styles.logo}  source={logo} />
            
          </Row>
          <Row style={{ backgroundColor: "#484848", 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch'}}>
            
              
           <View style={{flex:1, justifyContent:"center", alignItems: 'center', height:20}}>
            <Text style={{color:"#fff"}}>Cadastro Rápido</Text>
           </View>

           <View style={{flex:1, justifyContent:"center", alignItems: 'center'}}>
           {/* <GoogleSigninButton
            style={{ width: 312, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={this._signIn}
          /> */}

{/* <View style = {styles.container}>
                <TouchableHighlight onPress = {this.onButtonPressed}>
                    <View style = {styles.buttonWrapper}>
                        <Text style = {styles.buttonText}>Open Contact</Text>
                    </View>
                </TouchableHighlight>
            </View>  */}

            <TouchableHighlight style={{height: 150}} onPress={() => this.props.navigation.navigate('Home')}>
              <Image square style={styles.redes}  source={redes} />
            </TouchableHighlight>
           </View>
           <View style={{marginTop: 30, marginLeft: 35, height: 20, width: 305, 
                          flexDirection: 'row', alignItems:'center'}}>
              <Button transparent style={{flex:1, height:5}} onPress={()=> this.props.navigation.navigate('LoginSenha')}>
                <View style={{flex: 0.5, height:1, width: 16, backgroundColor:'#fff'}}></View>
                <View style={{flex: 1, height:20}}>
                  <Text style={{textAlign: "center", color:"#fff"}}>Login com senha</Text>
                </View>
                <View style={{flex: 0.5, height:1, width: 16, backgroundColor:'#fff'}}></View>
              </Button>
           </View>

           <View style={{marginTop: 8, marginLeft: 35, height: 20, width: 305, 
                          flexDirection: 'row', alignItems:'center'}}>
            <Button transparent style={{flex:1, height:5}} onPress={()=>this.props.navigation.navigate('CadastroComSenha')}>                            
              <View style={{flex: 0.5, height:1, width: 16, backgroundColor:'#fff'}}></View>
              <View style={{flex: 1, height:20}}>
                <Text style={{textAlign: "center", color:"#fff"}}>Cadastro de senha</Text>
              </View>
              <View style={{flex: 0.5, height:1, width: 16, backgroundColor:'#fff'}}></View>
            </Button>
          </View>
            
          
          <View style={{flex:1,justifyContent:"center", alignItems: 'center'}}>
            <Text style={{fontSize:13, padding:32, textAlign: "center", color:"#fff"}}>Ao cadastrar-me, declaro que eu sou maior de idade e aceito a Politica de Privacidade e os Termos e condições do aplicativo.</Text>
          </View>
          </Row>
        </Grid>
      </Container>
    );
  }
}

export default Login;
