import React from 'react'
import Pusher from "pusher-js";
import moment from "moment";
import Linkify from 'react-linkify';
import Grid from "@material-ui/core/Grid";
import {
  ThemeProvider,
  ChatList,
  ChatListItem,
  Avatar,
  Column,
  Row,
  Title,
  Subtitle,
  Message,
  MessageList,
  MessageGroup,
  MessageText,
  TextComposer,
  IconButton,
  AddIcon,
  TextInput,
  SendButton
} from "@livechat/ui-kit";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const ChatContainer = styled.div`
  height: calc(100vh - 64px);
  width: 100%;
`;

const ScrollableGrid = styled(Grid)`
  height: calc(100vh - 64px);
  overflow-y: scroll;
`;


 class Dashboard extends React.Component {
    state = {
        tweets: [],
        tweetThread: [],
        message: "",
        threadID: "",
        tweeted: false,
      };

    componentDidMount() {
        const self = this;
        const pusher = new Pusher("dccff05b7e18ab4cee90", {
            cluster: "ap2",
            forceTLS: true
            });
        const channel = pusher.subscribe("chat");
        channel.bind(this.props.user.currentUser.screenName, socketData => {
            localStorage.setItem('stream-connected', false);
            const tweetLoaded =
              this.state.tweets.filter(tweet => tweet.id_str === socketData.id_str).length > 0;
            if (!tweetLoaded) {
              const updatedTweets = [socketData, ...this.state.tweets].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              );
              this.setState({ tweets: updatedTweets }, () => {
                this.fetchTweetThread(this.state.threadID);
              });
            }
          });
          //console.log("token in front",this.props.user.token)
           fetch(`http://localhost:4000/twitter/tweets`, {
            method: "post",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              key: this.props.user.token,
              secret: this.props.user.tokenSecret
            })
          })
            .then(res => res.json())
            .then(function(data) {
              data = data.filter(tweet => !tweet.errors);
              data = data.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              );
              //console.log("tweet data", data)
              self.setState({ tweets: data });
            })
            .catch(function(error) {
              console.log("Request failed", error);
            }); 
      
    }
    fetchTweetThread = tweetID => {
        const { tweets } = this.state;
        const tweetsFromThread = [];
        const tweetThread = [...tweets].reverse().filter(tweet => {
          if (
            tweet.id_str === tweetID ||
            tweet.in_reply_to_status_id_str === tweetID
          ) {
            tweetsFromThread.push(tweet.id_str);
            return true;
          } else {
            if (tweetsFromThread.indexOf(tweet.in_reply_to_status_id_str) > -1) {
              tweetsFromThread.push(tweet.id_str);
              return true;
            }
            return false;
          }
        });
        this.setState({ tweetThread, threadID: tweetID });
      };
    
      postThreadReply = () => {
        const { message, tweetThread, threadID } = this.state;
        const self = this;
        this.setState({ tweeted: true });
    
        fetch(`http://localhost:4000/twitter/reply`, {
          method: "post",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            key: this.props.user.token,
            secret: this.props.user.tokenSecret,
            status: `@${tweetThread[0].user.screen_name} ${message}`,
            statusID: tweetThread[0].id_str,
            keywords: `@${tweetThread[0].user.screen_name},@${localStorage.getItem("username")}`,
            username: this.props.user.currentUser.screenName,
            streamConnected: localStorage.getItem('stream-connected')
          })
        })
          .then(res => res.json())
          .then(function(data) {
            //console.log("tweeted");
            const updatedTweets = [data, ...self.state.tweets].sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            self.setState({ tweets: updatedTweets }, () => {
              self.fetchTweetThread(threadID);
              self.setState({ tweeted: false });
              localStorage.setItem('stream-connected', true);
            });
          })
          .catch(function(error) {
            console.log("Request failed", error);
          });
      }
    
      updateNewStatus = (event) =>  {
        this.setState({ message: event.target.value });
      }
    render() {
        const { tweets, tweetThread, threadID, tweeted } = this.state;
        //console.log(this.state)
        return (
            <ThemeProvider>
        {tweets.length === 0 ? (
          <ProgressContainer>
            <CircularProgress style={{ margin: 12 }} />
          </ProgressContainer>
        ) : (
          <ChatContainer>
            <Grid container spacing={0}>
              <ScrollableGrid item xs={4} lg={3} md={3}>
                {Chatlist(tweets, this.fetchTweetThread, threadID)}
              </ScrollableGrid>
              <ScrollableGrid
                item
                xs={8}
                lg={9}
                md={9}
                style={{ borderLeft: "1px solid #8080803d" }}
              >
                {Messagelist(tweetThread, tweeted)}
                <TextComposer
                  style={{ minHeight: 150 }}
                  onChange={this.updateNewStatus}
                  onSend={this.postThreadReply}
                >
                  <Row align="center">
                    <IconButton fit>
                      <AddIcon />
                    </IconButton>
                    <TextInput />
                    <SendButton fit />
                  </Row>
                </TextComposer>
              </ScrollableGrid>
            </Grid>
          </ChatContainer>
        )}
      </ThemeProvider>      
        )
    }
}
const Chatlist = (tweets, fetchTweetThread, threadID) => {
    return (
      <ChatList>
        {tweets
          .filter(tweet => tweet.in_reply_to_status_id === null)
          .map(tweet => {
            return (
              <ChatListItem
                active={threadID === tweet.id_str}
                key={Number(tweet.id_str)}
                onClick={() => fetchTweetThread(tweet.id_str)}
              >
                <Avatar
                  letter={tweet.user.name.split("")[0]}
                  imgUrl={tweet.user.profile_image_url_https}
                />
                <Column>
                  <Row justify>
                    <Title ellipsis>{tweet.user.name.split(" ")[0]}</Title>
                    <Subtitle nowrap>
                      {moment(new Date(tweet.created_at)).format("LT")}
                    </Subtitle>
                  </Row>
                  <Subtitle ellipsis>{tweet.text}</Subtitle>
                </Column>
              </ChatListItem>
            );
          })}
      </ChatList>
    );
  };
  
  const Messagelist = (tweetThread, tweeted) => {
    const username = localStorage.getItem("username");
  
    return (
      <MessageList active>
        {tweetThread.map((thread, index) => (
          <MessageGroup
            avatar={thread.user.profile_image_url_https}
            onlyFirstWithMeta
            key={index}
            isOwn={username === thread.user.screen_name}
          >
            <Message
              authorName={
                username === thread.user.screen_name ? "You" : thread.user.name
              }
              date={`${moment(new Date(thread.created_at)).format(
                "ll"
              )} at ${moment(new Date(thread.created_at)).format("LT")}`}
            >
            <Linkify><MessageText>{thread.text}</MessageText></Linkify>
            </Message>
          </MessageGroup>
        ))}
        {/* {tweeted &&
          <div className="shimmer lc-1asrk6q eslhdd60">
            <div className="lc-x7rlc9 eslhdd61">
              <div className="lc-9z5quo e11ezd0e0">
                <img src="https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png" alt="profile logo placeholder" />
              </div>
            </div>
          <div className="lc-x0i9wh e1jdwequ0">
            <div>
              <div aria-expanded="false" className="lc-13e3qow e10ccb470">
                <div className="lc-81ie7q e10ccb473"><div><div className="lc-1rajx2j e10ccb472">
                  <span className="lc-1lt0t9n e10ccb471">You </span>
                  <span className="lc-1lt0t9n e10ccb474">Oct 2, 2019 at 2:11 AM</span>
                </div>
              </div>
          </div>
        </div></div></div></div>} */}
      </MessageList>
    );
  };


export default Dashboard