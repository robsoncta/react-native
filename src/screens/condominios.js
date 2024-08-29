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
  Toast,
} from "native-base";
import {AsyncStorage, Platform, Image, StyleSheet,  FlatList, TouchableOpacity} from "react-native";
import axios from '../service/axios';
import styles from '../config/styles';


const avatar = require("../../assets/local.png");
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

  textNome: {
    fontSize: 20
  },
  textbloco: {
    fontSize: 17
  },

  textCelular: {
    fontSize: 13,
    // width:'90%'
    width: 250
  },

  textFuncao: {
    fontSize: 13,
    marginBottom: 12
  },

  listItem: {
    flexDirection: "row",
    marginBottom: 15,
    paddingBottom:5,
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
class Condominios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab1: true,
      tab2: false,
      active: false,
      carregar:false,
      condominios: []
	};
	this._selCond = this._selCond.bind(this);
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
	axios.get(`/usuario/getCondominios/${id}`)
	.then(res => {
		// alert(JSON.stringify(res.data[0].Condominio))
	this.setState({
		condominios: res.data[0].Condominio,
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



    _selCond = async (user) => {
		try {
    
			await AsyncStorage.setItem('CondominioID', "" +user['Condominio']['$oid']);
			await AsyncStorage.setItem('CondominioNome', "" +user['Nome'] );
			await AsyncStorage.setItem('CondominioEnd', "" +user['Endereco'] );
	    await AsyncStorage.setItem('ResidenciaID', "" +user['Unidade']._id['$oid']);
	    await AsyncStorage.setItem('ResidenciaNome', "" +user['Unidade'].Nome);
		 	this.props.navigation.navigate('Home');
	
		} catch (error) {
		  alert(error)
		}
	}

    //  renderItem = ({ item }) => (
    //   <TouchableOpacity  onPress = {() => {this._selCond(item);}}>
    //       <View style={stylesList.listItem}>
    //         <View style={stylesList.avatar}>
    //           <Thumbnail square source={avatar}/>
    //         </View>
    //         <View style={stylesList.infoContato}>
    //           <View>
    //             <Text style={stylesList.textNome}>{item.Nome}</Text>
    //             <Text style={stylesList.textCelular}>{item.Endereco}</Text>
    //             <View><Image square style={stylesList.setLista} source={setLista}/></View>
    //           </View>
    //         </View>
    //       </View>
    //   </TouchableOpacity>
    // );
     renderItem = ({ item }) => (
      <TouchableOpacity  onPress = {() => {this._selCond(item);}}>
          <View style={stylesList.listItem}>
            <View style={stylesList.avatar}>
              <Thumbnail square source={avatar}/>
            </View>
            <View style={stylesList.infoContato}>
              <View>
                <Text style={stylesList.textNome}>{item.Nome}</Text>
                <Text style={stylesList.textbloco}>{item.Unidade.Nome}</Text>
                <Text style={stylesList.textCelular}>{item.Endereco}</Text>
                <View>
                <Image square style={stylesList.setLista} source={setLista}/>
              </View>
              </View>
              
            </View>
          </View>
      </TouchableOpacity>
    );

  render() {
    return (
      <Container style={styles.container}>
        <Header>
            <Left style={{flex:1}}>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="ios-menu" style={{color:"#fff"}} />
            </Button>
            </Left>
            <Body style={{flex:1, justifyContent:"center"}}>
                <Title style={{ alignSelf: "center", width: 150, fontSize:15, color:"#fff", textAlign:'center' }}>Minhas Unidades</Title>
            </Body>
            <Right style={{flex:1}}/>
        </Header>

        <Content>
            {/* <H1 style={{margin:20, fontWeight:'bold', color:"#777"}}>Escolha uma opção</H1> */}
            {this.state.carregar?(
                //this.state.condominios.map(cond => (
                    // <Text>Condominio</Text>
                    <FlatList
                    style={{ marginTop: 30 }}
                    contentContainerStyle={stylesList.list}
                    data={this.state.condominios}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.name}
                  />
               // ))
            ):(<Spinner color="blue" />)}
            {/* <View>
                <Button transparent info style={{width:"100%",marginTop:10,justifyContent:"center"}}  onPress={()=>this.props.navigation.navigate('CadastroVisitante')}>
                    <Text style={{textAlign:"center"}}>+ Adicionar novo contato</Text>
                </Button>
            </View> */}
           
        </Content>
      </Container>
    );
  }
}

export default Condominios;
