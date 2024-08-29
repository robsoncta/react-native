import { StyleSheet, Dimensions, Platform } from 'react-native';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default StyleSheet.create({
	container: {
		backgroundColor: "#FFF"
	},
	titleHeader:{
		textAlign:"center",
		backgroundColor:"red"
	},
	/* Home Screen */
	textPeriodo:{
		color: "#d3d3d3",
		fontSize:14
	},
	textQuando:{
		color: "#d3d3d3",
		margin:15, 
		fontSize:20, 
		marginTop:10,
	},
	buttonsHeader:{
        flex:1,
        height:130,
        margin:5
	  },
	  logo: {
		// position: "absolute",
		// left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
		// top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
		width: Platform.OS === 'ios' ? 400 : 300,
		height: Platform.OS === 'ios' ? 400 : 300,
		// borderRadius:100,
		// marginLeft:10,
		marginTop: Platform.OS === 'ios' ? 60 : 15,
		resizeMode: "contain"
		},
		redes: {
			// position: "absolute",
			// left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
			// top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
			width: 300,
			height: 150,
			// borderRadius:100,
			// marginLeft:10,
			
			resizeMode: "contain"
		},
		loading: {
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			opacity: 0.5,
			backgroundColor: 'black',
			justifyContent: 'center',
			alignItems: 'center'
		},
		areasAcesso:{
			flex:1,
			flexDirection: 'row',
			flexWrap: 'wrap',
			margin:15,
			marginBottom: 10
		}

});
