import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Body,
  Left,
  Text,
  Thumbnail,
  Right,
  H1,
  Icon,
  View,
  Spinner,
  Toast
} from "native-base";
import {AsyncStorage, Platform, Image, StyleSheet,  FlatList, TouchableOpacity} from "react-native";
import axios from '../service/axios';
import styles from '../config/styles';


const avatar = require("../../assets/contacts/person.png");
const setLista = require("../../assets/setLista.png");


const stylesList = StyleSheet.create({
  list: {
    paddingHorizontal: 15,
  },

  avatar: {
    flexDirection: 'row'
  },

  infoContato: {
    flexDirection: 'column', 
    marginLeft: 20,
    marginTop:1
  },

  textNome: {
    fontSize: 20
  },

  textCelular: {
    fontSize: 13,
    marginTop:1
  },

  textFuncao: {
    fontSize: 13,
    marginBottom: 12
  },

  listItem: {
    flexDirection: "row",
    paddingBottom:10,
    marginBottom: 15,
    borderBottomColor: '#777',
    borderBottomWidth: 0.3
  },
  setLista: {
    width: 15,
    height: 15,
    textAlign: "right",
    marginLeft: Platform.OS === 'ios' ? 250 : 230,
    marginTop: -30
}

});
class Contatos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab1: true,
      tab2: false,
      active: false,
      carregar:false,
      contatos: []
    };
  }
  toggleTab1() {
   
  }
  toggleTab2() {
    this.props.navigation.navigate('Servicos');
  }

  carregaInfo = async() => {
    this.getListContacts(); 
  }

	  willFocus = this.props.navigation.addListener(
      'willFocus',
      (payload) => {
        this.carregaInfo();
      }
	  );

    getListContacts = async () => {
      let id = await AsyncStorage.getItem('userID');
      axios.get(`/usuario/getContatos/${id}`)
      .then(res => {
        this.setState({
            contatos: res.data.contatos,
          carregar:true
          })
      }).catch((e) => {
          Toast.show({
                text: "Ops algo deu errado! Tente novamente",
                buttonText: "Ok",
                position: "top",
                type: "danger"
              })
      });
     }

     renderItem = ({ item }) => (
      // alert(JSON.stringify(item)),
      <TouchableOpacity onPress = {() => { this.props.navigation.navigate('Visitante', {
        itemId: item._id,
        Nome:item.Nome,
        Celular: item.Celular,
        Prestador: item.Prestador,
        Email: item.Email,
        Documento: item.Documento,
        Servico: item.Servico,
        //Codigo: item.
        });  }}>
        <View style={stylesList.listItem}>
          <View style={stylesList.avatar}>
            <Thumbnail style={{width:37, height:37}} square source={avatar}/>
          </View>
          <View style={stylesList.infoContato}>
            <Text style={stylesList.textNome}> {item.Nome} </Text>
            <Text style={stylesList.textCelular}> Celular: {item.Celular}</Text>
            {item.Prestador?(
              <Text style={stylesList.textFuncao}> Prestador: {item.Prestador}</Text>
            ):null}
            <View>
              <Image square style={stylesList.setLista} source={setLista}/>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

  render() {
    return (
      <Container style={styles.container}>
        <Header>
            <Left style={{flex:0.15}}>
            <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                    <Icon name="arrow-back" style={{color:"#fff"}} />
                </Button>
            </Left>
            <Body style={{flex:1, justifyContent:"center", alignItems:"center"}}>
              <Title style={{ alignSelf: "center", marginLeft: -50, fontSize: 13, color: '#fff', textAlign: "center" }}>Meus Convidados</Title>
            </Body>
            {/* <Right style={{flex:1}}/> */}
        </Header>

        <Content>
            {/* <H1 style={{margin:20, fontWeight:'bold', color:"#777"}}>Lista de Contato</H1> */}
            {this.state.carregar?(
              <FlatList
              style={{ marginTop: 30 }}
              contentContainerStyle={stylesList.list}
              data={this.state.contatos}
              renderItem={this.renderItem}
              keyExtractor={item => item.name}
            />
            ):(<Spinner color="blue" />)}
            <View>
                <Button transparent info style={{width:"100%",marginTop:10,justifyContent:"center"}}  onPress={()=>this.props.navigation.navigate('CadastroVisitante')}>
                    <Text style={{textAlign:"center"}}>+ Adicionar novo contato</Text>
                </Button>
            </View>
           
        </Content>
      </Container>
    );
  }
}

export default Contatos;
