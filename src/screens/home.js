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
import {AsyncStorage, Platform, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions} from "react-native";
import axios from '../service/axios';
import styles from '../config/styles';


const ic_acesso = require("../../assets/ic_acessos_ativo.png");
const ic_servicos = require("../../assets/ic_delivery_inativo.png");
const condominio = require("../../assets/troca_condominio.png");
const acesso = require("../../assets/icon_acesso.png");
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
    fontSize: 13
  },

  textFuncao: {
    fontSize: 13,
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab1: true,
      tab2: false,
      carregar:false,
	  contatos: [],
    CondominioNome: '',
    ResidenciaNome:''
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

	getListContacts = async () => {
    this.setState({
      carregar:false
    });
	let id = await AsyncStorage.getItem('userID');
  let CondominioNome = await AsyncStorage.getItem('CondominioNome');
  let ResidenciaNome = await AsyncStorage.getItem('ResidenciaNome');
	let CondominioID = await AsyncStorage.getItem('CondominioID');
	let ResidenciaID = await AsyncStorage.getItem('ResidenciaID');
  this.setState({CondominioNome, ResidenciaNome}); 
      axios.get(`/acessos/getAcessos/${id}/V/${CondominioID}/${ResidenciaID}`)
      .then(res => {
        //alert(JSON.stringify(res.data.acessos))
        this.setState({
            contatos: res.data.acessos,
            carregar:true
          })
      }).catch((e) => {
        //alert(JSON.stringify(e))
          Toast.show({
                text: "Ops algo deu errado! Tente novamente",
                buttonText: "Ok",
                position: "top",
                type: "danger"
              })
      });
  }
  
  // renderItem = ({ item }) => (
  //   <TouchableOpacity onPress = {() => { this.props.navigation.navigate('EditaAcesso', {
	// 	itemId: item.id,
	// 	Nome:item.Nome,
	// 	Inicio: item.Inicio,
	// 	Fim: item.Fim,
	// 	Periodo: item.Periodo,
	// 	//Codigo: item.
	//   });  }}>
  //     <View style={stylesList.listItem}>
  //       <View style={stylesList.avatar}>
  //         <Thumbnail square source={acesso}/>
  //       </View>
  //       <View style={stylesList.infoContato}>
  //         <Text style={stylesList.textNome}>{item.Nome}</Text>
  //         <Text style={stylesList.textCelular}>De {item.Inicio} até: {item.Fim}</Text>
  //         <Text style={stylesList.textFuncao}>Periodo: {item.Periodo}</Text>
  //         {/* <Text style={stylesList.textNomeCod}>Cod. {item.Codigo}</Text> */}
  //       </View>
  //     </View>
	// </TouchableOpacity>
  // );

  _listEmptyComponent = () => {
    return (
        <View style={{margin:15}}>
           <Text style={{textAlign:"center"}}>Você ainda não acessos para esse condomínio</Text>
        </View>
    )
}


  renderItem = ({ item }) => (
    <TouchableOpacity onPress = {() => { this.props.navigation.navigate('EditaAcesso', {
		itemId: item.id,
		Nome:item.Nome,
		Inicio: item.Inicio,
		Fim: item.Fim,
		Periodo: item.Periodo,
		//Codigo: item.
	  });  }}>
      <View style={stylesList.listItem}>
        <View style={stylesList.avatar}>
          <Thumbnail square source={acesso}/>
        </View>
        <View style={stylesList.infoContato}>
          <Text style={stylesList.textNome}>{item.Nome}</Text>
          <Text style={stylesList.textCelular}>De {item.Inicio} até: {item.Fim}</Text>
          <Text style={stylesList.textFuncao}>Periodo: {item.Periodo}</Text>
          {/* <Text style={stylesList.textNomeCod}>Cod. {item.Codigo}</Text> */}
          <View>
                <Image square style={stylesList.setLista} source={setLista}/>
              </View>
        </View>
      </View>
	</TouchableOpacity>
  );
  toggleTab1() {
   
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

        {/* <WebView style={{flex:1, height:400, width:400, justifyContent:"center"}} source={{ uri: 'http://www.janelas.tv.br/camera-ao-vivo/sp/santos/ponta-da-praia/' }} /> */}
            
			<TouchableOpacity style={{margin:15}} onPress = {() => { this.props.navigation.navigate('Condominios');  }}>
				<View style={stylesList.listItemCondominio}>
					<View style={stylesList.avatar}>
					<Thumbnail square source={condominio}/>
					</View>
					<View style={stylesList.infoCondominio}>
					  <H1 style={{margin:10, marginBottom:0, fontWeight:'bold', color:"#777"}}>{this.state.CondominioNome}</H1>
					  <Text style={{marginTop:5, marginLeft:10,fontWeight:'bold', color:"#777"}}>{this.state.ResidenciaNome}</Text>
					</View>
				</View>
			</TouchableOpacity>

          {/* <H1 style={{margin:20, fontWeight:'bold', color:"#777"}}>Acessos</H1> */}

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
            onPress={() => this.props.navigation.navigate("CadastroAcesso",{page: 'Sidebar'})}
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

export default Home;
