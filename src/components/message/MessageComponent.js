import React, { Component } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import CardView from 'react-native-cardview';
import { Column as Col, Row } from 'react-native-flexbox-grid';
import { GiftedChat, Bubble, MessageText, Send, InputToolbar } from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import styles from '../../styles/message/MessageStyles';
import headerStyles from '../../styles/header/HeaderStyles';
import AuthRealmServices from '../../Realm/AuthRealm';
import { Utils } from '../utils/Utils';

export default class MessageComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      chatHeight: 60,
      loginUser: Utils.currentUser()
    }
  }

  componentDidMount() {
    this.msgRef = database().ref('Messages').orderByChild("createdAt")
      .on('child_added', snapShot => {
        var msg = snapShot.val()
        let giftChatMsg = {};
        giftChatMsg = {
          text: msg.text,
          createdAt: msg.createdAt,
          _id: msg.msgId,
          user: {
            _id: msg.userId,
            name: msg.name
          }
        }
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, giftChatMsg)
        }))
      });
  }

  renderMessageText = (props) => {
    const {
      currentMessage,
    } = props;
    const { text: currText } = currentMessage;
    if (currText.indexOf('[x]') === -1) {
      return <MessageText {...props} />;
    }
    return <CustomMessageText {...props} />
  };

  renderSend(props) {
    return (
      <Send
        {...props}
        containerStyle={styles.sendContainer}>

        <Image source={require('../../../assets/icons/send.png')}
          style={{
            marginTop: 0,
            width: 40,
            height: 40
          }} />
      </Send>
    );
  }

  renderInputToolbar(props) {
    //Add the extra styles via containerStyle
    return <InputToolbar
      {...props}
      containerStyle={{
        borderTopWidth: 1.5,
        borderTopColor: 'transparent',
        height: 60
      }}>
      <TextInput
        multiline
        onContentSizeChange={e => this.setState({ chatHeight: e.nativeEvent.contentSize.height })}
      />
    </InputToolbar>
  }

  render() {
    
    return (
      <View style={styles.container}>
        <CardView
          style={headerStyles.container}
          cardElevation={2}
          cardMaxElevation={2}>
          <Row size={12}>
            <Col sm={5} md={4} lg={3}>
              <Text style={headerStyles.header_label}>Messages</Text>
            </Col>
            <Col sm={7}>
              <View style={headerStyles.search_planner_view}>
                <TouchableOpacity
                  style={headerStyles.seach_planner_btn_mview}
                  onPress={() => this.props.navigation.navigate(Utils.ANNOUNCEMENT_SCREEN)}>
                  <Image
                    style={headerStyles.search_planner_menuBtn}
                    source={require('../../../assets/icons/announcement.png')}
                  />
                </TouchableOpacity>
              </View>
            </Col>
          </Row>
        </CardView>
        <GiftedChat
          messages={this.state.messages}
          onSend={(message) => {
            var msg = message[0]
            console.log("MSG ID >>> " + msg._id)
            this.msgRef = database().ref('Messages').child(msg._id)
            this.msgRef.set({
              text: msg.text,
              name: msg.user.name,
              userId: msg.user._id,
              createdAt: Date.parse(msg.createdAt),
              msgId: msg._id
            }).then((data) => {
              console.log("Chat Msg Data == " + data+" -- "+msg.text+" ::: "+msg.user._id+" :: "+msg.user.name+" >>> "+msg.createdAt)
            }).catch((error) => {
              console.log("Error Chat msg === " + error)
            })
          }}
          isTyping={true}
          minInputToolbarHeight={56}
          textInputProps={{
            style: {
              width: '86%',
              height: 56,
              fontSize: 16,
              color: "black",
              paddingTop: 6,
              paddingLeft: 16,
              paddingRight: 16
            }
          }}
          textInputStyle={styles.composer}
          multiline={true}
          minComposerHeight={40}
          minInputToolbarHeight={this.state.chatHeight}
          alwaysShowSend={true}
          showUserAvatar={false}
          maxInputLength={100}
          scrollToBottom={true}
          showAvatarForEveryMessage={false}
          user={{
            _id: this.state.loginUser[0].id,
            name: this.state.loginUser[0].name,
          }}
          renderUsernameOnMessage={true}
          renderSend={this.renderSend}
          renderAvatar={null}
          renderMessageText={this.renderMessageText}
          renderInputToolbar={this.renderInputToolbar}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: '#fff',
                  },
                  left: {
                    color: '#000'
                  }
                }}
                wrapperStyle={{
                  left: {
                    backgroundColor: '#fff',
                    margin: 10
                  },
                  right: {
                    backgroundColor: '#000',
                    margin: 10
                  }
                }}
              />
            );
          }}
        />
      </View>
    );
  }
}
