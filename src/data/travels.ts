import type { TravelPlace, TravelVisit } from '@/types/universe';
export const places: TravelPlace[] = [
  {id:'tokyo',name:'Tokyo',english:'Tokyo',country:'Japan',latitude:35.6762,longitude:139.6503,description:'Working as a frontend engineer at Tata Consultancy Services in Tokyo.'},
  {id:'osaka',name:'Osaka',english:'Osaka',country:'Japan',latitude:34.6937,longitude:135.5023,description:'Pursuing a master’s degree in Economics at The University of Osaka.'},
  {id:'beijing',name:'Beijing',english:'Beijing',country:'China',latitude:39.9042,longitude:116.4074,description:'A city I went to during my internship at ByteDance.'},
  {id:'guangzhou',name:'Guangzhou',english:'Guangzhou',country:'China',latitude:23.1291,longitude:113.2644,description:'My birthplace and the city where I received my education from primary school through high school.'},
  {id:'bangkok',name:'Bangkok',english:'Bangkok',country:'Thailand',latitude:13.7563,longitude:100.5018,description:'A relaxed city with a character all its own. Thailand’s distinctive culture made a lasting impression on me.'},
  {id:'seoul',name:'Seoul',english:'Seoul',country:'South Korea',latitude:37.5665,longitude:126.9780,description:'To me, Seoul brings together qualities I appreciate in both China and Japan: an easygoing, relaxed urban atmosphere alongside a highly developed economy.'},
];
// Dates remain unspecified until personal timelines are supplied.
export const visits: TravelVisit[] = places.map(place=>({
  id:`${place.id}-experience`,placeId:place.id,visitedAt:{precision:'unknown'},
  title:({tokyo:'Frontend Engineering in Tokyo',osaka:'Economics at The University of Osaka',beijing:'My ByteDance Internship',guangzhou:'Where I Grew Up',bangkok:'A Distinctive, Relaxed City',seoul:'An East Asian Perspective'} as Record<string,string>)[place.id],
  description:place.description,photos:[],storyIds:[],status:'public',demo:false,
}));
