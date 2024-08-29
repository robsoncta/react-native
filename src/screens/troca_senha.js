import React, { Component } from "react";
import { AsyncStorage } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Body,
  Left,
  Form,
  Text,
  Item,
  Input,
  Icon,
  H1,
  Spinner,
  Toast
} from "native-base";
import styles from '../config/styles';
import axios from '../service/axios';

class TrocaSenha extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Senha:'',
        SenhaF:'',
        buttonDisabled: false
    };
    this._cadastro = this._cadastro.bind(this);
  }

  _cadastro = async () => {
    let id = await AsyncStorage.getItem('userID');

        if(this.state.Senha != this.state.SenhaF){
            Toast.show({
                text: "As senhas não conferem...",
                buttonText: "Ok",
                position: "top",
                type: "danger"
              })
            return false;
        }
    this.setState({buttonDisabled: true});

        axios.post(`/usuario/trocaSenha/${id}`, {
                'Senha':this.state.Senha,
        })
        .then(res => {
        if(res.data.usuario){
            this._storeData(res.data.usuario);
            Toast.show({
                text: "Senha alterada com sucesso!",
                buttonText: "Ok",
                position: "top",
                type: "success"
              })
            this.setState({buttonDisabled: false, Senha:'', SenhaF:''});
            this.props.navigation.navigate('Home');
        }else{
          Toast.show({
            text: "Ops... Algo deu errado! Tente novamente",
            buttonText: "Ok",
            position: "top",
            type: "danger"
          })
          this.setState({buttonDisabled: false});
        }
      }).catch((e) => {
          //alert(JSON.stringify(e));
        Toast.show({
            text: "Ops... Algo deu errado! Tente novamente",
            buttonText: "Ok",
            position: "top",
            type: "danger"
          })
          this.setState({buttonDisabled: false});
    });
      
  }

  _storeData = async (user) => {
    try {
        this.setState({
            Senha:'',
            SenhaF:''
        })
        //this.props.navigation.navigate('Home');
    } catch (error) {
      alert(error)
    }
  };

  render() {
    return (
      <Container style={styles.container}>

        <Header style={styles.header}>
            <Left style={{width:10  }}>
                <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                    <Icon name="arrow-back" style={{color:'#fff'}}/>
                </Button>
            </Left>
            <Body style={{flex:3 , justifyContent:"center", alignContent: "center" }}>
                <Title style={{ alignSelf: "center", fontSize:19, color: '#fff', textAlign:"center" }}>Trocar Senha</Title>
            </Body>
        </Header>

        <Content>
        
        <H1 style={{margin:20, fontWeight:'bold', color:"#777"}}>Escolha uma nova senha </H1>

        <Form style={{ width:"90%" }}>            
            <Item style={{marginTop: 15}}>
              <Input autoCapitalize = "none"  value={this.state.Senha} onChangeText={(Senha) => this.setState({Senha})} placeholder="Senha" />
            </Item>
            <Item style={{marginTop: 15}}>
              <Input autoCapitalize = "none" value={this.state.SenhaF} onChangeText={(SenhaF) => this.setState({SenhaF})} placeholder="Confirmar Senha" />
            </Item>
          </Form>
          <Button disabled={this.state.buttonDisabled} onPress={this._cadastro} bordered info style={{width:"90%", justifyContent:"center",   margin: 15, marginTop: 100 }}>
                {this.state.buttonDisabled?(
                    <Spinner size="large" color="#0000ff" />
                ):(
                    <Text style={{textAlign:"center"}}>TROCAR SENHA</Text>
                )}
          </Button>
           
        </Content>
       
      </Container>
    );
  }
}

export default TrocaSenha
