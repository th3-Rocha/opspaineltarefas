"use client";
import Image from "next/image";
import Header from "@/components/header/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const userName = useState("");
  const [user_name, setUser_name] = useState("");
  const [user_pic, setUser_pic] = useState("");
  const [isProfileClicked, setIsProfileClicked] = useState(false);

  const router = useRouter();
  const credential = sessionStorage.getItem("google_access_token");
  useEffect(() => {
    if (credential == null) {
      console.log("Access token not found.");
      router.push("/");
    } else {
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${credential}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            //console.log("Error:", data.error);
            router.push("/");
          }
          console.log("UserInfo:", data);
          setUser_name(data.name);
          setUser_pic(data.picture);
        })
        .catch((err) => console.error("Error Not find:", err));
    }
  }, [router]);

  useEffect(() => {
    if (isProfileClicked) {
      console.log("LogOut");
      // se usar o Script da Google Identity Services google.accounts.id.revoke(...
      fetch("https://oauth2.googleapis.com/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `token=${credential}`,
      });
      sessionStorage.setItem("google_access_token", "");
      router.push("/");
    }
  }, [isProfileClicked, router]);

  return (
    <div className="">
      <Header
        name={user_name}
        picUrl={user_pic}
        onProfileClick={() => setIsProfileClicked(true)}
      />
    </div>
  );
}