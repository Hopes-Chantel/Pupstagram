import { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import PageHeader from "../../components/Header/Header";
import Loading from "../../components/Loader/Loader";
import ProfileBio from "../../components/ProfileBio/ProfileBio";
import PostGallery from "../../components/PostGallery/PostGallery";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";

import userService from "../../utils/userService";
import * as likesAPI from '../../utils/likeApi';

import { useParams } from "react-router-dom";





export default function ProfilePage(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  // We need to grab the username out of the url,
  const { username } = useParams();


  async function addLike(postId){
    try {
      const data = await likesAPI.create(postId)
      console.log(data, ' <- the response from the server when we make a like');
      getProfile(); // <- to go get the updated posts with the like
    } catch(err){
      console.log(err)
      setError(err.message)
    }
  }

  async function removeLike(likeId){
    try {
      const data = await likesAPI.removeLike(likeId);
      console.log(data, '<-  this is the response from the server when we remove a like')
      getProfile()
      
    } catch(err){
      console.log(err);
      setError(err.message);
    }
  }

  async function getProfile() {
    try {
      const data = await userService.getProfile(username);
      console.log(data, " < -- data");
      setLoading(() => false);
      setUser(() => data.user);
      setPosts(() => data.posts);
    } catch (err) {
      console.log(err);
      setError("Profile Doesn't exists, CHECK YOUR TERMINAL FOR EXPRESS!");
    }
  }


  // then when the component loads we can use that username to fetch all the users data
  // then we can store that in state
  useEffect(() => {
    getProfile();
  }, []);




  if (error) {
    return (
      <>
        <PageHeader handleLogout={props.handleLogout} user={props.user}/>
        <ErrorMessage error={error} />;
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageHeader handleLogout={props.handleLogout} user={props.user}/>
        <Loading />
      </>
    );
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <PageHeader handleLogout={props.handleLogout} user={props.user}/>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <ProfileBio user={user} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered>
        <Grid.Column style={{ maxWidth: 750 }}>
        <PostGallery
            isProfile={true}
            posts={posts}
            numPhotosCol={3}
            user={props.user}
            addLike={addLike}
            removeLike={removeLike}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

