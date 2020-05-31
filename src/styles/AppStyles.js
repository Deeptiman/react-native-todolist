import {StyleSheet, Dimensions} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff'
      },
      drawerContainer:{
        flex: 1,
        flexDirection: 'column'
      },
      drawerHeaderContainer:{
        height: hp('20%'),
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      drawerHeaderImage:{
        width: 100,
        height: 100,
        padding: 10,
      },
      drawerHeaderText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
      },
      drawerMenuParentItemView: {
        height: hp('8%'),
        flexDirection: 'row'
      },
      drawerMenuSelectedParentItemView: {
        height: hp('8%'),
        flexDirection: 'row',
        backgroundColor: '#f2f2f2'
      },
      drawerMenuItemIconView:{
        width: wp('15%'),
        height: hp('8%'),
        justifyContent: 'center',
        alignItems: 'center',
      },
      drawerMenuItemIcon:{
        width: 25,
        height: 25,
      },
      drawerMenuItemLabelView:{
        width: wp('40%'),
        height: hp('8%'),
        justifyContent: 'center',
      },
      drawerMenuItemLabel:{
        fontSize: 18,
        color: '#000',
      },
      scrollView: {
        
      },
      listHeader: {
        backgroundColor: '#eee',
        color: "#222",
        height: 44,
        padding: 12
      },
      detailContainer: {
        paddingHorizontal: 20
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 10
      },
      message: {
        fontSize: 14,
        paddingBottom: 15,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1
      },
      dp:{
        marginTop: 32,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center'
      },
      engine: {
        position: 'absolute',
        right: 0,
      },
      body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      },
      sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center'
      },
      buttonContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center'
      },
      studyIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 300,
      },
      sectionTitle: {
        fontSize: 34,
        fontWeight: '600',
        color: '#000000',
      },
      sectionHeader: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
      },
      googleSignInButton: {
        width: 250,
        height: 70,
      },
      mainContainer: {
        flex: 1, 
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
      },
      sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: '#000000',
      },
      highlight: {
        fontWeight: '700',
      },
      footer: {
        color: '#000000',
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
      },
      plannerBar: {
        fontSize: 12,
        height: hp('9%')        
      },
      plannerContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      },
      plannerHeader: {
        width: '100%',
        backgroundColor: "#ffffff",
        borderRadius: 0,
        borderWidth: 1,
        borderColor: "#ff2200",
        minHeight: 40,
        paddingTop: 8,
        paddingRight: 16,
        paddingBottom: 8,
        paddingLeft: 16,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 20
      },
      plannerWelcome: {
        color: '#662e00',
        fontSize: 25,
        textAlign: 'center',
        marginTop: 20
      },
      plannerInstructions: {
          textAlign: 'center',
          color: '#333333',
          marginBottom: 5,
      },
      plannerTextInput:{
        fontSize: 18,
        color: '#000',
        marginLeft: 45,
        height: hp('7%')
      }
});