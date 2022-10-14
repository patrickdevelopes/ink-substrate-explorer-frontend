import Image from 'next/future/image'
import Link from 'next/link'
import React, { useState, useEffect } from "react";
import { Nav } from 'react-bootstrap'
import logo from '../../assets/img/logo.svg'
import { useRouter } from 'next/router'
import { Sidebar } from "../../interfaces/sidebar";
import Menu from '../../json/Sidebar.json';



function Navbar() {
  const [dataJson, setMenu] = useState<Sidebar[]>([]);;
  const router = useRouter();

  useEffect(() => {
    setMenu(Menu);
  }, []);

  return (
    <>
      <div>
        <Image src={logo} alt="Logo" className="ink_sidebar-logo" />
        <Nav activeKey={router.pathname} className="flex-column">
          {dataJson.map((item, index) => (
            <>
              <Link href={item.route} key={index} >
                <Nav className={"ink_sidebar-item" + (router.pathname === item.route ? " ink_sidebar-item_active" : "")}>
                  <Image src={`/sidebar/${item.img}`} width="24" height="24" alt={item.label} className="ink_sidebar-icon" /> <span>{item.label}</span>
                </Nav>
              </Link>
            </>
          ))}
        </Nav>
      </div>
    </>
  )
}

export default Navbar
