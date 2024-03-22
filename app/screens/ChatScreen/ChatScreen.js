import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { Card, Button } from "react-native-elements";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { Dialogflow_V2 } from "react-native-dialogflow";

import { dialogFlowConfig } from "../../../env";

const botAvatar = require("../../../assets/images/istockphoto-1221348467-612x612.jpg");

const BOT = {
  _id: 2,
  name: "Mr.Bot",
  avatar: botAvatar,
};

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogFlowConfig.client_email,
      dialogFlowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogFlowConfig.project_id
    );
  }, []);

  const onSend = (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const messageText = messages[0].text;

    Dialogflow_V2.requestQuery(
      messageText,
      (result) => handleGoogleResponse(result),
      (error) => console.log(error)
    );
  };

  const handleGoogleResponse = (result) => {
    const text = result.queryResult.fulfillmentMessages[0].text.text[0];

    sendBotResponse(text);
  };

  const renderBubble = (props) => {
    if (props.currentMessage.isOptions) {
      return (
        <ScrollView style={{ backgroundColor: "white" }} horizontal={true}>
          {props.currentMessage.data.map((item) => (
            <Card
              containerStyle={{
                padding: 0,
                borderRadius: 15,
                paddingBottom: 7,
                overflow: "hidden",
              }}
              key={item.title}
            >
              <Card.Image
                style={{ width: 220, height: 110 }}
                resizeMode="cover"
                source={{ uri: item.image }}
              />
              <Card.Divider />
              <Card.Title>{item.title}</Card.Title>
              <Button
                title="Choose"
                onPress={() => sendBotResponse(item.title)}
                style={{ height: 35 }}
              />
            </Card>
          ))}
        </ScrollView>
      );
    }
    return <Bubble {...props} />;
  };

  const sendBotResponse = (text) => {
    let msg;

    if (text === "show destinations") {
      msg = {
        _id: messages.length + 1,
        text: "There is a few options that might you like",
        createdAt: new Date().getTime(),
        user: BOT,
        isOptions: true,
        data: [
          {
            title: "Japan",
            image:
              "https://att-japan.net/wp-content/uploads/2023/06/pixta_97309535_M.webp",
          },
          {
            title: "France",
            image:
              "https://www.travelandleisure.com/thmb/9xr8CFGR14sLvR4IhLwKV64fEV0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-Eiffel-Tower-BESTFRANCE0323-dada0673f8764c099b68d01695ef8057.jpg",
          },
          {
            title: "Indonesia",
            image:
              "https://media.istockphoto.com/id/675172642/id/foto/pura-ulun-danu-bratan-temple-in-bali.jpg?s=612x612&w=0&k=20&c=s9gPvaz50WWHwkdZHZDUE4lEXXsHw3NmLFIwAed6aD0=",
          },
        ],
      };
    } else {
      msg = {
        _id: messages.length + 1,
        text,
        createdAt: new Date().getTime(),
        user: BOT,
      };
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [msg])
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      renderBubble={renderBubble}
      user={{ _id: 1 }}
    />
  );
};

export default ChatScreen;
