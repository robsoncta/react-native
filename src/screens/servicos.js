import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Footer,
  FooterTab,
  Body,
  Left,
  View,
  Toast,
  Text,
  Thumbnail,
  Right,
  H1,
  H2,
  Icon,
  Spinner
} from "native-base";
import {AsyncStorage, Platform, FlatList, StyleSheet, TouchableOpacity, Image} from "react-native";
import axios from '../service/axios';
import styles from '../config/styles';

const ic_acesso = require("../../assets/ic_acessos_inativo.png");
const ic_servicos = require("../../assets/ic_delivery_ativo.png");
const acesso = require("../../assets/moto.png");
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
    marginLeft: 20
  },
  infoCondominio: {
	flexDirection: 'column', 
	margin:0
  },

  textNome: {
    fontSize: 20
  },
  textNomeCod: {
    fontSize: 20,
    marginBottom: 12
  },

  textCelular: {
    fontSize: 13,
    marginTop:1
  },

  textFuncao: {
    fontSize: 13,
    marginTop:1,
    marginBottom: 12
  },

  listItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomColor: '#777',
    borderBottomWidth: 0.3
  },

  listItemCondominio: {
    flexDirection: "row",
    marginBottom: 15,
  },
  setLista: {
    width: 15,
    height: 15,
    textAlign: "right",
    marginLeft: Platform.OS === 'ios' ? 250 : 230,
    marginTop: -40
}
});

class Servicos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab1: false,
      tab2: true,
      carregar:false,
	  contatos: [],
	  CondominioNome: ''
    };
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

  _listEmptyComponent = () => {
    return (
        <View style={{margin:15}}>
           <Text style={{textAlign:"center"}}>Você ainda não delivery para esse condomínio</Text>
        </View>
    )
}

	getListContacts = async () => {
	let id = await AsyncStorage.getItem('userID');
  let CondominioNome = await AsyncStorage.getItem('CondominioNome');
  let CondominioID = await AsyncStorage.getItem('CondominioID');
  let ResidenciaID = await AsyncStorage.getItem('ResidenciaID');
	this.setState({CondominioNome}); 
    axios.get(`/acessos/getAcessos/${id}/D/${CondominioID}/${ResidenciaID}`)
      .then(res => {
      //alert(JSON.stringify(res.data.acessos))
        this.setState({
            contatos: res.data.acessos,
          carregar:true
          })

      }).catch((e) => {
        alert(JSON.stringify(e));
          Toast.show({
                text: "Ops algo deu errado! Tente novamente",
                buttonText: "Ok",
                position: "top",
                type: "danger"
              })
      });
  }
  
  renderItem = ({ item }) => (
    <TouchableOpacity onPress = {() => { this.props.navigation.navigate('CadastroDelivery', {
		itemId: item.id,
		Nome:item.Nome,
		Codigo: item.Codigo,
	  });  }}>
      <View style={stylesList.listItem}>
        <View style={stylesList.avatar}>
          <Thumbnail square source={acesso}/>
        </View>
        <View style={stylesList.infoContato}>
          <Text style={stylesList.textNome}>{item.Nome}</Text>
          <Text style={stylesList.textCelular}>Código {item.Codigo}</Text>
          <Text style={stylesList.textFuncao}>Data: {item.Inicio}</Text>
          {/* <Text style={stylesList.textNomeCod}>Cod. {item.Codigo}</Text> */}
          <View>
                <Image square style={stylesList.setLista} source={setLista}/>
              </View>
        </View>
      </View>
	</TouchableOpacity>
  );
  toggleTab1() {
    this.props.navigation.navigate('Home');
  }
  toggleTab2() {
    this.props.navigation.navigate('Servicos');
  }
  render() {
    return (
      <Container style={styles.container}>

        <Header>
            <Left style={{flex:1}}>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon style={{ alignSelf: "center", color: '#fff', textAlign: "center" }} name="ios-menu" />
            </Button>
            </Left>
            <Body style={{flex:1, justifyContent:"center"}}>
            <Title style={{ alignSelf: "center", color: '#fff', textAlign: "center" }}>NIOT</Title>
            </Body>
            <Right style={{flex:1}}/>
        </Header>

        <Content>
            
            <H1 style={{margin:20, fontWeight:'bold', color:"#777"}}>Delivery</H1>

          {this.state.carregar?(
                        <FlatList
                        style={{ marginTop: 30 }}
                        ListEmptyComponent={this._listEmptyComponent}
                        contentContainerStyle={stylesList.list}
                        data={this.state.contatos}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.name}
                      />
                      ):(<Spinner color="blue" />)}
        </Content>
        <Button
            style={[styles.buttonsHeader, 
              {position:'absolute', 
                borderRadius:100, 
                backgroundColor:"#484848", 
                bottom:60, right:10,  width:60, height:60,
                alignItems:'center',
                justifyContent:'center',
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowOpacity: 0.5,
                elevation: 20,
                shadowRadius: 15 ,
                shadowOffset : { width: 1, height: 13},
                }]}
            onPress={() => this.props.navigation.navigate("CadastroDelivery", {
              itemId: '',
              Nome:'',
              Codigo: '',
              })}
            >
            <Icon style={{fontSize:18}} type="FontAwesome" name="plus" />
          </Button>
          <Footer>
          <FooterTab>
            <Button active={this.state.tab1} onPress={() => this.toggleTab1()}>
              {/* <Icon active={this.state.tab1} name="contact" /> */}
              <Image style={{width: 35, height: 35, resizeMode: 'contain'}} source={ic_acesso}/>
              <Text>Acessos</Text>
            </Button>
            <Button active={this.state.tab2} onPress={() => this.toggleTab2()}>
              <Image style={{width: 35, height: 35, resizeMode: 'contain'}} source={ic_servicos}/>
              <Text>Delivery</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default Servicos;
