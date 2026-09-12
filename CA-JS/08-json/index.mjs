import {jsonRoundTrip} from '../solutions.mjs';
const data={course:'JS',lessons:20,active:true,tags:['json','web']};
const encoded=JSON.stringify(data,null,2);console.log(encoded);console.log(jsonRoundTrip(data));
