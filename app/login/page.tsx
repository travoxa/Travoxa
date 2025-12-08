'use client'
import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Loading from "@/components/ui/components/Loading";
import { route } from "@/lib/route";

export default function LoginButton() {
  const { data: session } = useSession()

  const [login,setLogin] = useState(false);
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName] = useState('');
  const [email,setEmail] = useState('');
  const [pass,setPass] = useState('');
  const [RePass,setRePass] = useState('');
  const [errorMsg,setErrorMsg] = useState('sdfs');
  const [agreement,setAgreement] = useState(false);
  const [loading,setLoading] = useState(false);



  // const createAccount = async (email: string, password: string) => {
  //   try {
  //     const docRef = await addDoc(collection(db, "Accounts/Users"), {
  //       email: email,
  //       password: password,
  //       createdAt: serverTimestamp(),
  //     });
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // }


  const hashPassword = async (password: string) => {
    const buf = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buf);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }


  const checkIfUserExists = async (email: string) => {
    const q = query(collection(db, "Users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    return snapshot.docs.length > 0;
  }

  const createAccount = async() => {
    console.log(firstName,lastName,agreement)
    if(firstName && lastName && agreement){
      if(pass == RePass && pass.length > 7){
        if(await checkIfUserExists(email)){
          setErrorMsg('Email is already in use');

        }else{
          setLoading(true);
          const hashedPassword = await hashPassword(pass);
          try {
            const docRef = await addDoc(collection(db, "Users"), {
              name:firstName + lastName,
              firstName : firstName,
              lastName : lastName,
              email: email,
              password: hashedPassword,
              createdAt: serverTimestamp(),
            });
            console.log("Document written with ID: ", docRef.id);
            setLoading(false);
            route('/');
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
      }else{
        setErrorMsg('Password must be at least 8 characters long and match the confirm password field');
      }
    }else{
      setErrorMsg('First name, last name and agreement must be filled');
    }
    setLoading(false);
  }


  if (session) {
    return (
      <div className="w-screen h-screen p-[12px]" >
        <div className="bg-red-500 flex flex-col w-full h-full rounded-[12px]" >
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative max-w-screen overflow-hidden Inter w-screen h-screen flex justify-between items-center bg-[#02111d] px-[12px]" >

      {errorMsg.length > 0 && (
        <div className="absolute top-0 right-[-100px] transition-all duration-1000 ease-in-out"  >
          <div className="bg-red-500 p-[12px] rounded-[12px] ">
            <p className="text-white font-light" >{errorMsg}</p>
          </div>
        </div>
      )}

      
      
      
      {loading && <Loading />}
  
      {/* <button 
        className="Mont  bg-white px-[5vw] py-[24px] rounded-[12px] flex justify-center items-center flex-col gap-[12px]"
        onClick={() => signIn('google')}>Sign in with Google</button> */}
      <div 
        className="hidden lg:flex relative w-[calc(50vw-24px)] h-[calc(100vh-24px)] bg-cover bg-center rounded-[12px] " 
        style={{ backgroundImage: `url(/login/login.jpg)` }} >
        <p className="absolute top-[24px] left-[24px] Mont text-[24px] font-light text-white  uppercase" >TRAVOXA</p>
        <p className="absolute bottom-[24px] left-1/2 text-center transform -translate-x-1/2 text-white font-light Mont text-[2vw]" >Where will you go next?</p>
      </div>

      <div className="Mont w-full lg:w-[calc(50vw-24px)] px-[3vw] mt-[24px]" >
        {login && (
          <div className="" >
            <p className="text-white text-[36px] font-extrabold Mont" >Welcome Back! </p>
            <button 
              onClick={() => setLogin(!login)}
              className="text-white mt-[2.5vh] text-[12px] font-light" >Create a new Account! <span className="underline" >Click Here</span> </button>
            <input 
              className="mt-[24px] lg:mt-[9vh] bg-[#3e446250] text-white text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#ffffff99] w-full rounded-[6px] px-[24px] py-[16px] "
              type="text" 
              placeholder="Email" />
            <input 
              className="mt-[3vh] bg-[#3e446250] text-white text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#ffffff99] w-full rounded-[6px] px-[24px] py-[16px] "
              type="text" 
              placeholder="Enter your Password" />

            <div className="flex gap-[12px] items-center mt-[2.5vh]" >
              <input type="checkbox" />
              <p className="text-white text-[12px]" >I agree to the Terms & Conditions</p>
            </div>

            <button className="text-white font-light w-full bg-[#355483] mt-[6vh] rounded-[6px] py-[12px]" >
              Login
            </button>
          </div>
        )}
        {!login && (
          <div className="" >
            <p className="text-white text-[36px] font-extrabold Mont" >Create a new Account</p>
            <button 
              onClick={() => setLogin(!login)}
              className="text-white mt-[2.5vh] text-[12px] font-light" >Already have a  account! <span className="underline" >Login in Here</span> </button>


            <div className="w-full flex gap-[2.5vh] items-center" >
              <input 
                className="mt-[24px] lg:mt-[9vh] bg-[#3e446250] text-white text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#ffffff99] w-full rounded-[6px] px-[24px] py-[16px] "
                type="text" 
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)} />
              <input 
                className="mt-[24px] lg:mt-[9vh] bg-[#3e446250] text-white text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#ffffff99] w-full rounded-[6px] px-[24px] py-[16px] "
                type="text" 
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)} />
            </div>
            <input 
                className="mt-[2.5vh] bg-[#3e446250] text-white text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#ffffff99] w-full rounded-[6px] px-[24px] py-[16px] "
                type="email" 
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)} />
            <input 
              className="mt-[2.5vh] bg-[#3e446250] text-white text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#ffffff99] w-full rounded-[6px] px-[24px] py-[16px] "
              type="password" 
              placeholder="Enter your Password"
              onChange={(e) => setPass(e.target.value)} />
            <input 
              className="mt-[2.5vh] bg-[#3e446250] text-white text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#ffffff99] w-full rounded-[6px] px-[24px] py-[16px] "
              type="password" 
              placeholder="Re-Enter your Password"
              onChange={(e) => setRePass(e.target.value)} />

            <div className="flex gap-[12px] items-center mt-[2.5vh]" >
              <input 
                type="checkbox" 
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)} />
              <p className="text-white text-[12px]" >I agree to the Terms & Conditions</p>
            </div>

            <button 

              onClick={createAccount}
              className={`
                
                 text-white font-light w-full bg-[#355483] mt-[6vh] rounded-[6px] py-[12px]`} >
              Create Account
            </button>
          </div>
        )}
        <div className="flex flex-col justify-center items-center mt-[24px]" >
          <div className="h-px w-full bg-[#3e4462] mt-[20px]" ></div>
          <p className="text-[#3e4462] text-[12px]  w-fit mt-[-10px] bg-[#02111d] px-[12px]" >OR</p>
        </div>

        <button 
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="flex gap-[12px] justify-center items-center text-white font-light border border-[#3e4462] w-full mt-[36px] rounded-[6px] py-[12px]" >
          <img 
            width={16}
            src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw" alt="" />  Google
        </button>
      </div>

      
    </div>
    );
}