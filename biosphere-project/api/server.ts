import axios from 'axios';
import key from './.key';

const graphQLEndpoint =
   'https://eu-west-1.aws.realm.mongodb.com/api/client/v2.0/app/application-0-xlzdn/graphql';
const headers = {
   'content-type': 'application/json',
   apiKey: `${key}`,
};

const sendPost = (base64: string) => {
   axios({
      url: graphQLEndpoint,
      method: 'post',
      headers: headers,
      data: {
         query: `
            mutation {
            insertOneImage(data: {base64: "${base64}"}) {
              _id
              base64
                }
              }`,
      },
   })
      .then((result) => {
         //   console.log(result.data, "axios return");
      })
      .catch((err) => {
         console.log(err);
      });
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

// const getGeo = async () => {
//   return axios({
//       url: graphQLEndpoint,
//       headers: headers,
//      method: 'post',
//      data: {
//         query: `
//            query {
//               geoTagData {
//               title
//               location {
//                  lat
//                  long
//                  }
//               }
//            }
//         `,
//      },
//   })
//      .then(response => {
//         console.log(response.data.data.geoTagData);
//         return response.data.data.geoTagData;
//      })
//      .catch(err => console.log(err));
// };

export { sendPost, getMarkers }
