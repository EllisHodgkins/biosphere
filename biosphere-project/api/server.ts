import axios from "axios";
import key from "./.key";

const graphQLEndpoint =
  "https://eu-west-1.aws.realm.mongodb.com/api/client/v2.0/app/application-0-xlzdn/graphql";
const headers = {
  "content-type": "application/json",
  apiKey: `${key}`,
};

const getMarkers = (lat, long, latDelta, longDelta) => {
  const latMin = `"53.388471"`; // <=== `"${lat - latDelta}"`;
  const latMax = `"53.572871"`; // <=== `"${lat + latDelta}"`;
  const longMin = `"-2.27776"`; // <=== `"${long - longDelta}"`;
  const longMax = `"-2.19356"`; // <=== `"${long + longDelta}"`;

  return axios({
    url: graphQLEndpoint,
    method: "post",
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
             likes
             long
             title
             user
           }}
       `,
    },
  })
    .then((result) => result.data.data.geoTagData)
    .catch((err) => console.log(err));
};

const sendPost = (post) => {
  // console.log(
  //   post.captured,
  //   post.category,
  //   post.description,
  //   post.image,
  //   post.latitude,
  //   post.longitude,
  //   post.title,
  //   post.user,
  //   post.tags,
  //   "inputs"
  // );
  const mgTimeStamp = `"${post.captured}"`;
  const mgCategory = `"${post.category}"`;
  const mgDescription = `"${post.description}"`;
  const mgImage = `"${post.image}"`;
  const mgLat = `"${post.latitude}"`;
  const mgLong = `"${post.longitude}"`;
  const mgTitle = `"${post.title}"`;
  const mgUser = `"${post.user}"`;
  const mgTags = [];
  post.tags.forEach((tag) => {
    mgTags.push(`"${tag}"`);
  });

  // console.log(mgTags);

  axios({
    url: graphQLEndpoint,
    method: "post",
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
                    tags: ${mgTags}
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
      console.log(result.data, "axios return");
    })
    .catch((err) => {
      console.log(err);
    });
};

export { sendPost, getMarkers };
