import React, { useState } from 'react'

const Otpbox = ({length,onChangeOTP,Correct}) => {
    
    const [otp,setOtp]=useState(new Array(length).fill(""));
    const handleChange = (element, index) => {
        const value = element.value;
        if (value && !isNaN(value)) { 
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            onChangeOTP(newOtp.join(""));

            if (index < length - 1) {
                element.nextSibling?.focus();
            }
        }
    };
 const handleBackspace=(element,index)=>{
    const newOtp=[...otp];
    newOtp[index]="";
    setOtp(newOtp);

    if(index > 0)
    {
        element.previousSibling.focus();
    }
    onChangeOTP(newOtp.join(""));
 }
    
  return (
     <div className="flex justify-center gap-3">
        {
            otp.map((data,index)=>{
                return(
                    <input 
                    key={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    className={ `w-12 h-14 sm:w-14 sm:h-16 border-2 text-2xl font-semibold rounded-xl text-center focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm ${Correct ? 'border-green-500 bg-green-50 text-green-700 ring-green-500' : 'border-slate-200 focus:ring-primary-500 bg-white text-slate-800'}` }
                    onChange={(e)=>handleChange(e.target,index)}
                    onKeyDown={e=>{
                        if(e.key=='Backspace')
                        {
                            handleBackspace(e.target,index);
                        }
                    }
                    }
                     />
                )
            })
        }
     </div>
  )
}

export default Otpbox