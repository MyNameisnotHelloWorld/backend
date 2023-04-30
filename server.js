// import fetch from 'node-fetch';
// import http from "http";
// import parser from "body-parser";
// import geohash from 'ngeohash';
// import path from "path";
// import express from "express";
const http = require("http");
const parser  = require("body-parser");
const geohash = require('ngeohash');
const cors = require('cors');
const https = require("https");
const axios = require("axios")
const SpotifyWebApi = require('spotify-web-api-node');
const path = require('path');
const express = require("express");

// const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use(parser.json());

let port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('server running');
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});



app.get('/search',function(req,res) {
  res.json({"user":"good"})
});

app.get('/:kw/:dis/:location',function(req,res){
  var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=AY0kAQMXhyKSSYEQbDhYyT0IHkCH9tgE&"
  var location = req.params.location
  var kw = req.params.kw
  var dis = req.params.dis
  if(location == 'auto_detected'){
    var myloc = "https://ipinfo.io/64.136.145.103?token=1055805e13f2a6"
    https.get(myloc,(n_res)=>{
      var data = ""
    
      n_res.on('data',(part)=>{
        data += part
      });
    
      n_res.on('end',()=>{
        const info = JSON.parse(data)
        const location = info['loc'];
        
        const coordinates = location.split(',');
        const latitude = parseFloat(coordinates[0]);
        const longitude = parseFloat(coordinates[1]);
        const precision = 7; 
        const geohashResult = geohash.encode(latitude, longitude, precision);
        url = url+"keyword="+kw+"&radius="+dis+"&unit=miles"+"&geoPoint="+geohashResult
        https.get(url,(the_res)=>{
          var inside = ""
    
          the_res.on('data',(p)=>{
              inside += p
          });

          the_res.on('end',()=>{
            var final_inside = JSON.parse(inside)
            if (final_inside.hasOwnProperty("_embedded")){
              var theLst = data_processing(final_inside)
              // console.log(url)
              res.send(theLst)
             
            }else{
              // console.log(url)
              res.send([])
            }
            
          })

        }).on('error',(error)=>{
          console.log(error)
        })
      });
    
    }).on('error',(error)=>{
      console.log(error)
    })
    
    
  }else{
    location = req.params.location.toString().replace(/\s/g, '+');
    var google_url = "https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key=AIzaSyA1uqfylcObLd00G5_ewFbRwuNZdHz91Ho"
    axios.get(google_url).then((response)=>{
          var google_geo = response.data.results
          if(google_geo.length == 0){
            res.send([])
          }else{
            var geom = response.data.results[0].geometry.location
            
            const precision = 7; 
            const geohashResult = geohash.encode(geom['lat'], geom['lng'], precision);
            url = url+"keyword="+kw+"&radius="+dis+"&unit=miles"+"&geoPoint="+geohashResult
            axios.get(url).then((r)=>{
                
                if (r.data.hasOwnProperty("_embedded")){
                  var theLst = data_processing(r.data)
                  // console.log(url)
                  res.send(theLst)
                 
                }else{
                  // console.log(url)
                  res.send([])
                }
            }).catch((err)=>{
              console.log(err)
            })
          }
    }).catch((error)=>{
      console.log(error)
    })
    
  }
  

})

app.get('/:kw/:cate/:dis/:location',function(req,res){
  var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=AY0kAQMXhyKSSYEQbDhYyT0IHkCH9tgE&"
  var location = req.params.location
  var category = req.params.cate
  var kw = req.params.kw
  var dis = req.params.dis
  if(location == 'auto_detected'){
    var myloc = "https://ipinfo.io/64.136.145.103?token=1055805e13f2a6"
    https.get(myloc,(n_res)=>{
      var data = ""
    
      n_res.on('data',(part)=>{
        data += part
      });
    
      n_res.on('end',()=>{
        const info = JSON.parse(data)
        const location = info['loc'];
        
        const coordinates = location.split(',');
        const latitude = parseFloat(coordinates[0]);
        const longitude = parseFloat(coordinates[1]);
        const precision = 7; 
        const geohashResult = geohash.encode(latitude, longitude, precision);
        url = url+"keyword="+kw+"&segmentId="+category+"&radius="+dis+"&unit=miles"+"&geoPoint="+geohashResult
        https.get(url,(the_res)=>{
          var inside = ""
    
          the_res.on('data',(p)=>{
              inside += p
          });

          the_res.on('end',()=>{
            var final_inside = JSON.parse(inside)
            if (final_inside.hasOwnProperty("_embedded")){
              var theLst = data_processing(final_inside)
              // console.log(url)
              res.send(theLst)
             
            }else{
              // console.log(url)
              res.send([])
            }
          })

        }).on('error',(error)=>{
          console.log(error)
        })
      });
    
    }).on('error',(error)=>{
      console.log(error)
    })
    
    
  }else{
    location = req.params.location
    var google_url = "https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key=AIzaSyA1uqfylcObLd00G5_ewFbRwuNZdHz91Ho"
    axios.get(google_url).then((response)=>{
          var google_geo = response.data.results
          if(google_geo.length == 0){
            res.send([])
          }else{
            var geom = response.data.results[0].geometry.location
            
            const precision = 7; 
            const geohashResult = geohash.encode(geom['lat'], geom['lng'], precision);
            url = url+"keyword="+kw+"&segmentId="+category+"&radius="+dis+"&unit=miles"+"&geoPoint="+geohashResult
            axios.get(url).then((r)=>{
                // console.log(r.data)
                
                if (r.data.hasOwnProperty("_embedded")){
                  var theLst = data_processing(r.data)
                  // console.log(url)
                  res.send(theLst)
                 
                }else{
                  // console.log(url)
                  res.send([])
                }
            }).catch((err)=>{
              console.log(err)
            })
          }
    }).catch((error)=>{
      console.log(error)
    })
    
  }
  

})

app.get("/artist/:art",function(req,res){
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setCredentials({
    clientId: '0edab29fd53b4c4b83b5ba3ac918783b',
    clientSecret: 'e6a10f6e663c484ea6c63d19ae4ea0b9'
  });
  spotifyApi.clientCredentialsGrant().then(
    function(data_1) {
      // console.log('The access token is ' + data_1.body['access_token']);
      spotifyApi.setAccessToken(data_1.body['access_token']);
      var art = req.params.art.toString().replace(/\s/g, '+')
      spotifyApi.searchArtists(art).then(function(data) {
              // console.log('Search artists by ', data.body);
              res.send(process_artist(data.body))
      }, function(err) {
              console.error(err);
      })
  },
    function(err) {
    console.log('Something went wrong!', err);
    }
  );
  
})



app.get("/albums/:art",function(req,res){
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setCredentials({
    clientId: '0edab29fd53b4c4b83b5ba3ac918783b',
    clientSecret: 'e6a10f6e663c484ea6c63d19ae4ea0b9'
  });
  spotifyApi.clientCredentialsGrant().then(
    function(data_1) {
      // console.log('The access token is ' + data_1.body['access_token']);
      spotifyApi.setAccessToken(data_1.body['access_token']);
      var art = req.params.art
      spotifyApi.getArtistAlbums(art,{ limit: 10, offset: 20 }).then(
        function(data) {
            var image = []
            for(let i = 0 ; i<data.body.items.length; i++){
              var details = data.body.items[i]
              if(details.hasOwnProperty("images")){
                var the_image = data.body.items[i].images
                if (the_image.length>0){
                  image.push(data.body.items[i].images[0].url)
                }
              }
            }
            // console.log(image)
            res.send(image)
          
          // console.log('Artist albums', data.body.items);
        },
        function(err) {
          console.error(err);
        }
      );
  },
    function(err) {
    console.log('Something went wrong!', err);
    }
  );
  
})


app.get('/venues/:id',function(req,res){
  var url = "https://app.ticketmaster.com/discovery/v2/venues/"+req.params.id+".json?apikey=AY0kAQMXhyKSSYEQbDhYyT0IHkCH9tgE"
  axios.get(url).then((response)=>{
      var details = {}
      details["generalRule"] = ""
      details["phone"] = ""
      details["open_hour"] = ""
      details["generalRule"] = ""
      details["childRule"] = ""
      details["loc"] = [response.data.location.longitude, response.data.location.latitude]
      details["address"] = response.data.address.line1+", "+response.data.city.name+", "+response.data.state.name+", "+response.data.country.name
      details["street"] = response.data.address.line1
      if(response.data.hasOwnProperty("boxOfficeInfo")){
          var box = response.data.boxOfficeInfo
          if(box.hasOwnProperty("phoneNumberDetail")){
            details["phone"] = box.phoneNumberDetail
          }else{
            details["phone"] = ""
          }

          if(box.hasOwnProperty("openHoursDetail")){
            details["open_hour"] = box.openHoursDetail
          }else{
            details["open_hour"] = ""
          }

          if(box.hasOwnProperty("generalInfo")){
            var generalInfo = box.generalInfo
            if(generalInfo.hasOwnProperty("generalRule")){
                details["generalRule"] = generalInfo.generalRule
            }else{
                details["generalRule"] = ""
            }
            if(generalInfo.hasOwnProperty("childRule")){
              details["childRule"] = generalInfo.childRule
            }else{
              details["childRule"] = ""
            }
          }


        }
        if(response.data.hasOwnProperty("generalInfo")){
          var generalInfo = response.data.generalInfo
          if(generalInfo.hasOwnProperty("generalRule")){
              details["generalRule"] = generalInfo.generalRule
          }else{
              details["generalRule"] = ""
          }
          if(generalInfo.hasOwnProperty("childRule")){
            details["childRule"] = generalInfo.childRule
          }else{
            details["childRule"] = ""
          }
        }
        
        res.send([response.data,details])


  }).catch((err)=>{
    console.log(err)
  })
})


// async function data_processing(final_inside){
//   var data_copy = final_inside._embedded.events
//   var theLst = []
//   // console.log(final_inside._embedded.events)
//   for(let i = 0;i<data_copy.length;i++){
//     var the_details = {};
//     var part = data_copy[i]
//     the_details["event"] = part.name
//     the_details["event_status"] = part.dates.status.code
//     the_details["genre"] = ""
//     the_details["all_artist"] = []
//     if(part.dates.start.hasOwnProperty("localTime")){
//       the_details["localTime"] = part.dates.start.localTime
//     }else{
//       the_details["localTime"] = "00:00:00"
//     }
//     the_details["localDate"] = part.dates.start.localDate

//     if(part.hasOwnProperty("classifications")){
//         the_details["classifications"] = part.classifications[0].segment.name
//         the_details["genre"] += part.classifications[0].segment.name
//     }else{
//         the_details["classifications"] = ""
//     }
//     var all_type = part.classifications[0]
//     if (all_type.hasOwnProperty("genre")){
//       const n3 = all_type.genre.name
//       console.log(n3!=="Undefined")
//       if(n3!=="Undefined" && n3!=='undefined'){
//         the_details["genre"]+=" | "
//         the_details["genre"]+=all_type.genre.name
//       }else{
//         console.log("null genre")
//       }
//     }

//     if (all_type.hasOwnProperty("subGenre")){
//       const n1 = all_type.subGenre.name
//       console.log(n1!=="Undefined")
//       if(n1!=="Undefined" || n1!=='undefined'){
//         the_details["genre"]+=" | "
//         the_details["genre"]+=all_type.subGenre.name
//       }else{
//         console.log("null subGenre")
//       }
//     }

//     if (all_type.hasOwnProperty("type")){
//       const n = all_type.type.name
//       console.log(n!=="Undefined")
//       if(n!=="Undefined" && n!=="undefined"){
//         the_details["genre"]+=" | "
//         the_details["genre"]+=n
//       }else{
//         console.log("null type")
//       }
//     }

//     if (all_type.hasOwnProperty("subType")){
//       const n2 = all_type.subType.name
//       console.log(n2!=="Undefined")
//       if(n2!=="Undefined" && n2!=='undefined'){
//         the_details["genre"]+=" | "
//         the_details["genre"]+=all_type.subType.name
//       }else{
//         console.log("null subType")
//       }
//     }

//     if(part.hasOwnProperty("_embedded")){
//       if(part._embedded.hasOwnProperty("venues")){
//           var venue_part = part._embedded.venues[0]
//           the_details["venue_id"] = venue_part.id
//           if(venue_part.hasOwnProperty("name")){
//               the_details["venue_name"] = venue_part.name
//           }else{
//             the_details["venue_name"] = ""
//           }
//       }else{
//         the_details["venue_name"] = ""
//       }
//     }else{
//       the_details["venue_name"] = ""
//     }
//     var content = ""
//     if(part._embedded.hasOwnProperty("attractions")){
//         var t = part._embedded.attractions
//         for (let i =0;i<t.length;i++){
//           if(i!=t.length-1){
//               content += t[i].name + " | "
//               try {
//                 let artistResult = await getAllArtist(t[i].name);
//                 the_details["all_artist"].push(artistResult);
//               } catch (error) {
//                 console.log("Error fetching artist data: ", error);
//               }
              
//           }else{
//               content += t[i].name
//               try {
//                 let artistResult = await getAllArtist(t[i].name);
//                 the_details["all_artist"].push(artistResult);
//               } catch (error) {
//                 console.log("Error fetching artist data: ", error);
//               }
//           }
//         }
//         if(content.length==0){
//             content = ""
//         }
//     }else{
//       content = ""
//     }
//     the_details["content"] = content


//     var price;
//     if(part.hasOwnProperty("priceRanges")== false){
//             price = ""
//     }else{
//             var min_price = ""
//             if(part["priceRanges"][0].hasOwnProperty("min") ){
//                 min_price = String(part["priceRanges"][0]["min"])
//             }
//             var max_price = ""
//             if(part["priceRanges"][0].hasOwnProperty("max")){
//                 max_price = String(part["priceRanges"][0]["max"])
//             }
//             if(min_price!="" & max_price!=""){
//                 if(min_price!=max_price){
//                   price = min_price+" - "+max_price 
//                 }else{
//                   price = min_price
//                 }
//             }else if(min_price!=""){
//                 price = String(min_price)
//             }else if(max_price!=""){
//                 price = String(max_price)
//             }else{
//                 price = ""
//             }
//     }

//     the_details["price"] = price

//     var map_url = ""
//     if(part.hasOwnProperty("seatmap")){
//             if(part.seatmap.hasOwnProperty("staticUrl")){
//                 map_url = part.seatmap.staticUrl
//             }
//     }

//     the_details["image"] = part.images[0].url
//     the_details["map_url"] = map_url
//     the_details["url"] = part.url
//     theLst.push(the_details)
//     // console.log(content)
    
   
//   }
  
//   return theLst

      
// }

function process_artist(the_data){
  var item = the_data.artists.items
  var artist_lst = []
  for(let i =0 ; i<item.length; i++){
      var details = {}
      details["spotify_url"] = item[i].external_urls.spotify
      details["followers"] = item[i].followers.total
      details["name"] = item[i].name
      details["popularity"] = item[i].popularity
      details["id"] = item[i].id
      details["images"] = ""
      if(item[i].hasOwnProperty("images")){
        var imgae_list = item[i].images
        if (imgae_list.length>0){
          var image = imgae_list[0]
          if(image.hasOwnProperty("url")){
            var thePic = image["url"]
            details["images"] = thePic
          }
        }
      }
      
      artist_lst.push(details)
  }
  return artist_lst
}

function getAllArtist(name) {
  return new Promise(async (resolve, reject) => {
      var spotifyApi = new SpotifyWebApi();
      spotifyApi.setCredentials({
          clientId: '0edab29fd53b4c4b83b5ba3ac918783b',
          clientSecret: 'e6a10f6e663c484ea6c63d19ae4ea0b9'
      });

      try {
          const data_1 = await spotifyApi.clientCredentialsGrant();
          // console.log('The access token is ' + data_1.body['access_token']);
          spotifyApi.setAccessToken(data_1.body['access_token']);
          var art = name.toString().replace(/\s/g, '+');

          spotifyApi.searchArtists(art).then(function(data) {
              // console.log('Search artists by ', data.body);
              var final = process_artist(data.body);
              resolve(final);
          }, function(err) {
              console.error(err);
              reject(err);
          });

      } catch (err) {
          console.log('Something went wrong!', err);
          reject(err);
      }
  });
}

function venue_info(v) {
  const apiKey = 'AY0kAQMXhyKSSYEQbDhYyT0IHkCH9tgE';
  const url = `https://app.ticketmaster.com/discovery/v2/venues/${v}.json?apikey=${apiKey}`;

  return fetch(url)
      .then(response => response.json())
      .then(data => {
          let details = {};
          details["generalRule"] = "";
          details["phone"] = "";
          details["open_hour"] = "";
          details["generalRule"] = "";
          details["childRule"] = "";
          details["loc"] = [data.location.longitude, data.location.latitude];
          details["address"] = `${data.address.line1}, ${data.city.name}, ${data.state.name}, ${data.country.name}`;
          details["street"] = data.address.line1;

          if (data.hasOwnProperty("boxOfficeInfo")) {
              let box = data.boxOfficeInfo;

              details["phone"] = box.phoneNumberDetail || "";
              details["open_hour"] = box.openHoursDetail || "";

              if (box.hasOwnProperty("generalInfo")) {
                  let generalInfo = box.generalInfo;
                  details["generalRule"] = generalInfo.generalRule || "";
                  details["childRule"] = generalInfo.childRule || "";
              }
          }

          if (data.hasOwnProperty("generalInfo")) {
              let generalInfo = data.generalInfo;
              details["generalRule"] = generalInfo.generalRule || "";
              details["childRule"] = generalInfo.childRule || "";
          }

          return [data, details];
      })
      .catch(err => {
          console.log(err);
      });
}



function data_processing(final_inside){
  var data_copy = final_inside._embedded.events
  var theLst = []
  // console.log(final_inside._embedded.events)
  for(let i = 0;i<data_copy.length;i++){
    var the_details = {};
    var part = data_copy[i]
    the_details["event"] = part.name
    the_details["event_status"] = part.dates.status.code
    the_details["genre"] = ""
    if(part.dates.start.hasOwnProperty("localTime")){
      the_details["localTime"] = part.dates.start.localTime
    }else{
      the_details["localTime"] = "00:00:00"
    }
    the_details["localDate"] = part.dates.start.localDate

    if(part.hasOwnProperty("classifications")){
        the_details["classifications"] = part.classifications[0].segment.name
        the_details["genre"] += part.classifications[0].segment.name
    }else{
        the_details["classifications"] = ""
    }
    var all_type = part.classifications[0]
    if (all_type.hasOwnProperty("genre")){
      const n3 = all_type.genre.name
      // console.log(n3!=="Undefined")
      if(n3!=="Undefined" && n3!=='undefined'){
        the_details["genre"]+=" | "
        the_details["genre"]+=all_type.genre.name
      }else{
        console.log("null genre")
      }
    }

    if (all_type.hasOwnProperty("subGenre")){
      const n1 = all_type.subGenre.name
      // console.log(n1!=="Undefined")
      if(n1!=="Undefined" || n1!=='undefined'){
        the_details["genre"]+=" | "
        the_details["genre"]+=all_type.subGenre.name
      }else{
        console.log("null subGenre")
      }
    }

    if (all_type.hasOwnProperty("type")){
      const n = all_type.type.name
      // console.log(n!=="Undefined")
      if(n!=="Undefined" && n!=="undefined"){
        the_details["genre"]+=" | "
        the_details["genre"]+=n
      }else{
        console.log("null type")
      }
    }

    if (all_type.hasOwnProperty("subType")){
      const n2 = all_type.subType.name
      // console.log(n2!=="Undefined")
      if(n2!=="Undefined" && n2!=='undefined'){
        the_details["genre"]+=" | "
        the_details["genre"]+=all_type.subType.name
      }else{
        console.log("null subType")
      }
    }

    if(part.hasOwnProperty("_embedded")){
      if(part._embedded.hasOwnProperty("venues")){
          var venue_part = part._embedded.venues[0]
          the_details["venue_id"] = venue_part.id
          if(venue_part.hasOwnProperty("name")){
              the_details["venue_name"] = venue_part.name
          }else{
            the_details["venue_name"] = ""
          }
      }else{
        the_details["venue_name"] = ""
      }
    }else{
      the_details["venue_name"] = ""
    }
    var content = ""
    if(part._embedded.hasOwnProperty("attractions")){
        var t = part._embedded.attractions
        for (let i =0;i<t.length;i++){
          if(i!=t.length-1){
              content += t[i].name + " | "
              // try {
              //   let artistResult = await getAllArtist(t[i].name);
              //   the_details["all_artist"].push(artistResult);
              // } catch (error) {
              //   console.log("Error fetching artist data: ", error);
              // }
              
          }else{
              content += t[i].name
              // try {
              //   let artistResult = await getAllArtist(t[i].name);
              //   the_details["all_artist"].push(artistResult);
              // } catch (error) {
              //   console.log("Error fetching artist data: ", error);
              // }
          }
        }
        if(content.length==0){
            content = ""
        }
    }else{
      content = ""
    }
    the_details["content"] = content

    var price;
    if(part.hasOwnProperty("priceRanges")== false){
            price = ""
    }else{
            var min_price = ""
            if(part["priceRanges"][0].hasOwnProperty("min") ){
                min_price = String(part["priceRanges"][0]["min"])
            }
            var max_price = ""
            if(part["priceRanges"][0].hasOwnProperty("max")){
                max_price = String(part["priceRanges"][0]["max"])
            }
            if(min_price!="" & max_price!=""){
                if(min_price!=max_price){
                  price = min_price+" - "+max_price 
                }else{
                  price = min_price
                }
            }else if(min_price!=""){
                price = String(min_price)
            }else if(max_price!=""){
                price = String(max_price)
            }else{
                price = ""
            }
    }

    the_details["price"] = price

    var map_url = ""
    if(part.hasOwnProperty("seatmap")){
            if(part.seatmap.hasOwnProperty("staticUrl")){
                map_url = part.seatmap.staticUrl
            }
    }

    the_details["image"] = part.images[0].url
    the_details["map_url"] = map_url
    the_details["url"] = part.url
    the_details["twitter"] = `https://twitter.com/intent/tweet?url=${encodeURIComponent(part.url)}&text=${encodeURIComponent(`Checkout ${part.name} on TicketMaster`)}`
    the_details["facebook"] = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(part.url)}`
    // console.log(content)
    // console.log(the_details["all_artist"].length)
    theLst.push(the_details)
    
  }
  console.log(theLst)
  return theLst
}
