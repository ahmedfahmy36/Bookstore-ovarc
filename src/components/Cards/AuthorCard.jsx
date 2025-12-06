import React from "react";
import authorImg1 from "../../assets/a1.png";
import authorImg2 from "../../assets/a2.png";


const AuthorCard = ({ 
    name,
    noOfBooks,
   }) => {
    // use random image for author
    const ref = React.useRef(
        Math.floor(Math.random() * 2) === 0 ? authorImg1 : authorImg2
    );
     return (
       <div className="bg-white shadow-md rounded-lg p-4 h-[214px] w-112 flex gap-2 ">
         <div className=" grid items-center h-full w-32 " 
        >
           <img src={ref.current} alt={name} className="text-center font-light h-full w-full text-gray-800 text-wrap" />
         </div>
         <div className="flex flex-col  px-3 w-full h-full flex-1">
            <div className="flex-1">
             <p className=" text-wrap">{name}</p>
             <p className="text-sm text-main">Books published: {noOfBooks}</p>
             </div>
 
             <div className="flex  justify-end items-end">
                <button className="bg-main font-light text-white px-2 py-1 rounded">View Profile</button>
            </div>
                 
         </div>
       </div>
     );
   };
 export default AuthorCard;