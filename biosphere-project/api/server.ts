import axios from 'axios';
import key from './.key';

const graphQLEndpoint =
  'https://eu-west-1.aws.realm.mongodb.com/api/client/v2.0/app/application-0-xlzdn/graphql';
const headers = {
  'content-type': 'application/json',
  apiKey: `${key}`,
};

const getMarkers = (lat, long, latDelta, longDelta) => {
  const latMin = `"${lat - latDelta}"`;
  const latMax = `"${lat + latDelta}"`;
  const longMin = `"${long - longDelta}"`;
  const longMax = `"${long + longDelta}"`;

  return axios({
    url: graphQLEndpoint,
    method: 'post',
    headers: headers,
    data: {
      query: `
           query {
             geoTagData(
               query: {lat_gte: ${latMin},  lat_lte: ${latMax}, long_gte: ${longMin}, long_lte: ${longMax}})
               {
             _id
             captured
             category
             description
             image
             lat
             long
             title
             user
             tags
           }}
       `,
    },
  })
    .then((result) => result.data.data.geoTagData)
    .catch((err) => console.log(err));
};

const sendPost = (post) => {
  const mgTimeStamp = `"${post.captured}"`;
  const mgCategory = `"${post.category}"`;
  const mgDescription = `"${post.description}"`;
  const mgImage = `"${post.image}"`;
  const mgLat = `"${post.latitude}"`;
  const mgLong = `"${post.longitude}"`;
  const mgTitle = `"${post.title}"`;
  const mgUser = `"${post.user}"`;

  console.log(JSON.stringify(post.tags));

  axios({
    url: graphQLEndpoint,
    method: 'post',
    headers: headers,
    data: {
      query: `
            mutation {
                insertOneGeoTagDatum(
                data: {
                    captured: ${mgTimeStamp},
                    category: ${mgCategory},
                    description: ${mgDescription},
                    image: ${mgImage},
                    lat: ${mgLat},
                    long: ${mgLong},
                    title: ${mgTitle},
                    user: ${mgUser},
                    tags: ${JSON.stringify(post.tags)}
                },
                ) {
                _id
                captured
                category
                description
                image
                lat
                long
                title
                user
                tags
                }
            }
              `,
    },
  })
    .then((result) => {
      console.log(result.data, 'axios return');
    })
    .catch((err) => {
      console.log(err);
    });
};

const getSingleMarkerInfo = (marker) => {
  const markerId = `"${marker.id}"`;
  return axios({
    url: graphQLEndpoint,
    method: 'post',
    headers: headers,
    data: {
      query: `
             query{
    geoTagDatum(query: {_id: ${markerId}}) {
      _id
      captured
      category
      description
      image
      lat
      long
      title
      user
      tags
    }}
         `,
    },
  })
    .then((result) => result.data.data.geoTagDatum)
    .catch((err) => console.log(err));
};

export { sendPost, getMarkers, getSingleMarkerInfo };
